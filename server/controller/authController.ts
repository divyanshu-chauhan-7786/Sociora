import { Request, Response } from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import WorkspaceSettings from "../models/WorkspaceSettings.js";
import { presentUser } from "../utils/presenters.js";

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "fallback_secret", {
    expiresIn: "30d",
  });
};

const PASSWORD_REQUIREMENTS_MESSAGE =
  "Password must be at least 8 characters, start with an uppercase letter, and include a special character.";
const PASSWORD_REQUIREMENTS_PATTERN = /^[A-Z](?=.*[^A-Za-z0-9\s]).{7,}$/;

const isValidPassword = (password: string) => PASSWORD_REQUIREMENTS_PATTERN.test(password);

type OAuthProvider = "google" | "microsoft" | "facebook";

const clientOrigin = () => process.env.CLIENT_ORIGIN || "http://localhost:5173";

const serverOrigin = () => process.env.SERVER_PUBLIC_URL || `http://localhost:${process.env.PORT || 3000}`;

const providerConfig = (provider: OAuthProvider) => {
  const configs = {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
      tokenUrl: "https://oauth2.googleapis.com/token",
      userInfoUrl: "https://www.googleapis.com/oauth2/v3/userinfo",
      scope: "openid email profile",
    },
    microsoft: {
      clientId: process.env.MICROSOFT_CLIENT_ID,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
      authUrl: "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
      tokenUrl: "https://login.microsoftonline.com/common/oauth2/v2.0/token",
      userInfoUrl: "https://graph.microsoft.com/v1.0/me",
      scope: "openid email profile User.Read",
    },
    facebook: {
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      authUrl: "https://www.facebook.com/v20.0/dialog/oauth",
      tokenUrl: "https://graph.facebook.com/v20.0/oauth/access_token",
      userInfoUrl: "https://graph.facebook.com/me?fields=id,name,email",
      scope: "email,public_profile",
    },
  };

  return configs[provider];
};

const callbackUrl = (provider: OAuthProvider) =>
  `${serverOrigin()}/api/auth/oauth/${provider}/callback`;

const redirectWithAuthError = (res: Response, message: string) => {
  res.redirect(`${clientOrigin()}/login?error=${encodeURIComponent(message)}`);
};

const normalizeOAuthUser = (provider: OAuthProvider, profile: any) => {
  if (provider === "microsoft") {
    return {
      email: profile.mail || profile.userPrincipalName,
      name: profile.displayName,
    };
  }

  return {
    email: profile.email,
    name: profile.name,
  };
};

const getOrCreateOAuthUser = async (provider: OAuthProvider, profile: any) => {
  const { email, name } = normalizeOAuthUser(provider, profile);

  if (!email) {
    throw new Error(`${provider} did not return an email address. Please allow email permission.`);
  }

  const user = await User.findOneAndUpdate(
    { email },
    {
      $setOnInsert: {
        email,
        name: name || email.split("@")[0],
      },
    },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );

  await WorkspaceSettings.findOneAndUpdate(
    { user: user._id },
    { $setOnInsert: { user: user._id } },
    { upsert: true, setDefaultsOnInsert: true },
  );

  return user;
};

// Register a new user
// POST /api/auth/register
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name?.trim() || !email?.trim() || !password) {
      res.status(400).json({ message: "Name, email, and password are required" });
      return;
    }

    if (!isValidPassword(password)) {
      res.status(400).json({ message: PASSWORD_REQUIREMENTS_MESSAGE });
      return;
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({ name, email, password: hashedPassword });
    await WorkspaceSettings.create({ user: user._id });

    if (user) {
      res.status(201).json({
        user: presentUser(user),
        token: generateToken(user._id.toString()),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
      return;
    }
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error?.message || "Server Error" });
  }
};

// Login user
// POST /api/auth/login
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }

    const user = await User.findOne({ email });

    if (user && user.password && (await bcrypt.compare(password, user.password))) {
      res.json({
        user: presentUser(user),
        token: generateToken(user._id.toString()),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error?.message || "Server Error" });
  }
};

export const getCurrentUser = async (req: Request | any, res: Response): Promise<void> => {
  res.json({ user: presentUser(req.user) });
};

export const startOAuthLogin = async (req: Request, res: Response): Promise<void> => {
  const provider = req.params.provider as OAuthProvider;

  if (!["google", "microsoft", "facebook"].includes(provider)) {
    res.status(404).json({ message: "Unsupported auth provider" });
    return;
  }

  const config = providerConfig(provider);

  if (!config.clientId || !config.clientSecret) {
    redirectWithAuthError(res, `${provider} login is not configured yet. Add ${provider.toUpperCase()}_CLIENT_ID and ${provider.toUpperCase()}_CLIENT_SECRET in server/.env.`);
    return;
  }

  const state = jwt.sign({ provider }, process.env.JWT_SECRET || "fallback_secret", { expiresIn: "10m" });
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: callbackUrl(provider),
    response_type: "code",
    scope: config.scope,
    state,
  });

  if (provider === "google") {
    params.set("access_type", "offline");
    params.set("prompt", "select_account");
  }

  res.redirect(`${config.authUrl}?${params.toString()}`);
};

export const completeOAuthLogin = async (req: Request, res: Response): Promise<void> => {
  const provider = req.params.provider as OAuthProvider;
  const { code, state, error } = req.query;

  if (error) {
    redirectWithAuthError(res, String(error));
    return;
  }

  if (!code || !state || !["google", "microsoft", "facebook"].includes(provider)) {
    redirectWithAuthError(res, "OAuth callback is missing required data.");
    return;
  }

  try {
    const decoded = jwt.verify(String(state), process.env.JWT_SECRET || "fallback_secret") as { provider: OAuthProvider };

    if (decoded.provider !== provider) {
      redirectWithAuthError(res, "OAuth state mismatch. Please try again.");
      return;
    }

    const config = providerConfig(provider);
    const tokenBody = new URLSearchParams({
      client_id: config.clientId || "",
      client_secret: config.clientSecret || "",
      code: String(code),
      redirect_uri: callbackUrl(provider),
      grant_type: "authorization_code",
    });

    // DEBUG: Terminal mein check karne ke liye ki string length sahi hai ya nahi
    const secretLen = config.clientSecret ? config.clientSecret.length : 0;
    console.log(`[OAuth Debug] Secret loaded. Length: ${secretLen}, Starts with: ${config.clientSecret?.substring(0, 7)}`);

    const tokenResponse = await fetch(config.tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: tokenBody,
    });
    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok || !tokenData.access_token) {
      throw new Error(tokenData.error_description || tokenData.error?.message || "OAuth token exchange failed");
    }

    const profileResponse = await fetch(config.userInfoUrl, {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const profile = await profileResponse.json();

    if (!profileResponse.ok) {
      throw new Error(profile.error?.message || "Could not load social profile");
    }

    const user = await getOrCreateOAuthUser(provider, profile);
    const token = generateToken(user._id.toString());
    const userParam = encodeURIComponent(JSON.stringify(presentUser(user)));

    res.redirect(`${clientOrigin()}/oauth/callback?token=${encodeURIComponent(token)}&user=${userParam}`);
  } catch (callbackError: any) {
    redirectWithAuthError(res, callbackError?.message || "OAuth login failed");
  }
};
