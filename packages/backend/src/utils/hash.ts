import bcrypt from "bcrypt";

export const hash = async (content: string) => {
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(content, salt);
  return hashed;
};

export const compare = async (content: string, hashed: string) => {
  const valid = await bcrypt.compare(content, hashed);
  return valid;
};
