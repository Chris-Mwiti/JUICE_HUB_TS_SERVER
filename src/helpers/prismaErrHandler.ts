import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientRustPanicError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";
import LoggerHelper from "./logger";
import logger from "../util/functions/logger";

export type PrismaErrorTypes =
  | PrismaClientKnownRequestError
  | PrismaClientInitializationError
  | PrismaClientUnknownRequestError
  | PrismaClientRustPanicError
  | PrismaClientValidationError;

function prismaErrHandler(err: PrismaErrorTypes) {
  LoggerHelper.Logger(
    `${err?.message}\t ${err?.name}`,
    "databaseErrorLogs.txt"
  );
  logger("DB_ERROR").error(err?.message);
  console.error(err.message);
}

export default prismaErrHandler;
