/*
 * Copyright (C) 2018 Garden Technologies, Inc. <info@garden.io>
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as Joi from "joi"
import { ModuleVersion, moduleVersionSchema } from "../../vcs/base"
import { PrimitiveMap } from "../../config/common"
import { Module } from "../module"
import { ServiceStatus } from "../service"
import { moduleConfigSchema, ModuleConfig } from "../../config/module"
import { DashboardPage, dashboardPagesSchema } from "../../config/dashboard"
import { ProviderConfig, providerConfigBaseSchema, Provider } from "../../config/project"

export interface ConfigureProviderResult<T extends ProviderConfig = ProviderConfig> extends Provider<T> { }
export const configureProviderResultSchema = Joi.object()
  .keys({
    config: providerConfigBaseSchema,
  })

export interface EnvironmentStatus {
  ready: boolean
  needUserInput?: boolean
  dashboardPages?: DashboardPage[]
  detail?: any
}

export const environmentStatusSchema = Joi.object()
  .keys({
    ready: Joi.boolean()
      .required()
      .description("Set to true if the environment is fully configured for a provider."),
    needUserInput: Joi.boolean()
      .description(
        "Set to true if the environment needs user input to be initialized, " +
        "and thus needs to be initialized via `garden init`.",
      ),
    dashboardPages: dashboardPagesSchema,
    detail: Joi.object()
      .meta({ extendable: true })
      .description("Use this to include additional information that is specific to the provider."),
  })
  .description("Description of an environment's status for a provider.")

export type EnvironmentStatusMap = {
  [key: string]: EnvironmentStatus,
}

export interface PrepareEnvironmentResult { }

export const prepareEnvironmentResultSchema = Joi.object().keys({})

export interface CleanupEnvironmentResult { }

export const cleanupEnvironmentResultSchema = Joi.object().keys({})

export interface GetSecretResult {
  value: string | null
}

export const getSecretResultSchema = Joi.object()
  .keys({
    value: Joi.string()
      .allow(null)
      .required()
      .description("The config value found for the specified key (as string), or null if not found."),
  })

export interface SetSecretResult { }

export const setSecretResultSchema = Joi.object().keys({})

export interface DeleteSecretResult {
  found: boolean
}

export const deleteSecretResultSchema = Joi.object()
  .keys({
    found: Joi.boolean()
      .required()
      .description("Set to true if the key was deleted, false if it was not found."),
  })

export interface ExecInServiceResult {
  code: number
  output: string
  stdout?: string
  stderr?: string
}

export const execInServiceResultSchema = Joi.object()
  .keys({
    code: Joi.number()
      .required()
      .description("The exit code of the command executed in the service container."),
    output: Joi.string()
      .allow("")
      .required()
      .description("The output of the executed command."),
    stdout: Joi.string()
      .allow("")
      .description("The stdout output of the executed command (if available)."),
    stderr: Joi.string()
      .allow("")
      .description("The stderr output of the executed command (if available)."),
  })

export interface ServiceLogEntry {
  serviceName: string
  timestamp?: Date
  msg: string
}

export const serviceLogEntrySchema = Joi.object()
  .keys({
    serviceName: Joi.string()
      .required()
      .description("The name of the service the log entry originated from."),
    timestamp: Joi.date()
      .required()
      .description("The time when the log entry was generated by the service."),
    msg: Joi.string()
      .required()
      .description("The content of the log entry."),
  })
  .description("A log entry returned by a getServiceLogs action handler.")

export interface GetServiceLogsResult { }

export const getServiceLogsResultSchema = Joi.object().keys({})

export interface ModuleTypeDescription {
  docs: string
  schema: object
}

export const moduleTypeDescriptionSchema = Joi.object()
  .keys({
    docs: Joi.string()
      .required()
      .description("Documentation for the module type, in markdown format."),
    schema: Joi.object()
      .required()
      .description(
        "A valid OpenAPI schema describing the configuration keys for the `module` field in the module's `garden.yml`.",
      ),
  })

export type ConfigureModuleResult<T extends Module = Module> =
  ModuleConfig<
    T["spec"],
    T["serviceConfigs"][0]["spec"],
    T["testConfigs"][0]["spec"],
    T["taskConfigs"][0]["spec"]
  >

export const configureModuleResultSchema = moduleConfigSchema

export interface BuildResult {
  buildLog?: string
  fetched?: boolean
  fresh?: boolean
  version?: string
  details?: any
}
export const buildModuleResultSchema = Joi.object()
  .keys({
    buildLog: Joi.string()
      .allow("")
      .description("The full log from the build."),
    fetched: Joi.boolean()
      .description("Set to true if the build was fetched from a remote registry."),
    fresh: Joi.boolean()
      .description("Set to true if the build was performed, false if it was already built, or fetched from a registry"),
    version: Joi.string()
      .description("The version that was built."),
    details: Joi.object()
      .description("Additional information, specific to the provider."),
  })

export interface HotReloadServiceResult { }
export const hotReloadServiceResultSchema = Joi.object()

export interface PushResult {
  pushed: boolean
  message?: string
}
export const pushModuleResultSchema = Joi.object()
  .keys({
    pushed: Joi.boolean()
      .required()
      .description("Set to true if the module was pushed."),
    message: Joi.string()
      .description("Optional result message."),
  })

export interface PublishResult {
  published: boolean
  message?: string
}
export const publishModuleResultSchema = Joi.object()
  .keys({
    published: Joi.boolean()
      .required()
      .description("Set to true if the module was published."),
    message: Joi.string()
      .description("Optional result message."),
  })

export interface RunResult {
  moduleName: string
  command: string[]
  version: ModuleVersion
  success: boolean
  startedAt: Date
  completedAt: Date
  output: string
}

export const runResultSchema = Joi.object()
  .keys({
    moduleName: Joi.string()
      .description("The name of the module that was run."),
    command: Joi.array().items(Joi.string())
      .required()
      .description("The command that was run in the module."),
    version: moduleVersionSchema,
    success: Joi.boolean()
      .required()
      .description("Whether the module was successfully run."),
    startedAt: Joi.date()
      .required()
      .description("When the module run was started."),
    completedAt: Joi.date()
      .required()
      .description("When the module run was completed."),
    output: Joi.string()
      .required()
      .allow("")
      .description("The output log from the run."),
  })

export interface TestResult extends RunResult {
  testName: string
}

export const testResultSchema = runResultSchema
  .keys({
    testName: Joi.string()
      .required()
      .description("The name of the test that was run."),
  })

export const getTestResultSchema = testResultSchema.allow(null)

export interface BuildStatus {
  ready: boolean
}

export const buildStatusSchema = Joi.object()
  .keys({
    ready: Joi.boolean()
      .required()
      .description("Whether an up-to-date build is ready for the module."),
  })

export interface RunTaskResult extends RunResult {
  moduleName: string
  taskName: string
  command: string[]
  version: ModuleVersion
  success: boolean
  startedAt: Date
  completedAt: Date
  output: string
}

export const runTaskResultSchema = Joi.object()
  .keys({
    moduleName: Joi.string()
      .description("The name of the module that the task belongs to."),
    taskName: Joi.string()
      .description("The name of the task that was run."),
    command: Joi.array().items(Joi.string())
      .required()
      .description("The command that the task ran in the module."),
    version: moduleVersionSchema,
    success: Joi.boolean()
      .required()
      .description("Whether the task was successfully run."),
    startedAt: Joi.date()
      .required()
      .description("When the task run was started."),
    completedAt: Joi.date()
      .required()
      .description("When the task run was completed."),
    output: Joi.string()
      .required()
      .allow("")
      .description("The output log from the run."),
  })

export interface TaskStatus {
  done: boolean
}

export const taskStatusSchema = Joi.object()
  .keys({
    done: Joi.boolean()
      .required()
      .description("Whether the task has been successfully executed for the module's current version."),
  })

export interface PluginActionOutputs {
  configureProvider: Promise<ConfigureProviderResult>

  getEnvironmentStatus: Promise<EnvironmentStatus>
  prepareEnvironment: Promise<PrepareEnvironmentResult>
  cleanupEnvironment: Promise<CleanupEnvironmentResult>

  getSecret: Promise<GetSecretResult>
  setSecret: Promise<SetSecretResult>
  deleteSecret: Promise<DeleteSecretResult>
}

export interface ServiceActionOutputs {
  getServiceStatus: Promise<ServiceStatus>
  deployService: Promise<ServiceStatus>
  hotReloadService: Promise<HotReloadServiceResult>
  deleteService: Promise<ServiceStatus>
  getServiceOutputs: Promise<PrimitiveMap>
  execInService: Promise<ExecInServiceResult>
  getServiceLogs: Promise<{}>
  runService: Promise<RunResult>
}

export interface TaskActionOutputs {
  getTaskStatus: Promise<TaskStatus>
  runTask: Promise<RunTaskResult>
}

export interface ModuleActionOutputs extends ServiceActionOutputs {
  describeType: Promise<ModuleTypeDescription>
  configure: Promise<ConfigureModuleResult>
  getBuildStatus: Promise<BuildStatus>
  build: Promise<BuildResult>
  pushModule: Promise<PushResult>
  publishModule: Promise<PublishResult>
  runModule: Promise<RunResult>
  testModule: Promise<TestResult>
  getTestResult: Promise<TestResult | null>
}
