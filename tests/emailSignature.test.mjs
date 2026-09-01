import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { portfolioContent } from "../src/content/portfolio.ts";

const signatureUrl = new URL("../assets/email-signatures/patricio-montes-güemez-signature.html", import.meta.url);

test("maintained Gmail signature stays aligned with public portfolio contact data", async () => {
  const signature = await readFile(signatureUrl, "utf8");
  const { profile } = portfolioContent;

  assert.match(signature, /PM monogram for Patricio Montes Güemez/);
  assert.match(signature, new RegExp(profile.name));
  assert.match(signature, new RegExp(profile.title.en));
  assert.match(signature, /\+54 11 4051-8040/);
  assert.match(signature, new RegExp(`href="${profile.whatsapp}"`));
  assert.match(signature, new RegExp(`mailto:${profile.email}`));
  assert.match(signature, new RegExp(`href="${profile.linkedin}"`));
  assert.match(signature, new RegExp(`href="${profile.github}"`));
  assert.match(signature, new RegExp(`href="${profile.portfolio}"`));
  assert.doesNotMatch(signature, /GMAIL_UPLOADED_AVATAR_URL|<img\b|incoders/i);
});
