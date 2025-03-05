import { Snowflake } from "@sapphire/snowflake";

const EPOCH = 1609459200000; // 2021-01-01 기준
const snowflake = new Snowflake(EPOCH);

export const generateId = () => snowflake.generate().toString();
