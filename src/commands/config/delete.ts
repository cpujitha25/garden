/*
 * Copyright (C) 2018 Garden Technologies, Inc. <info@garden.io>
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { PluginContext } from "../../plugin-context"
import { Command, ParameterValues, StringParameter } from "../base"
import { NotFoundError } from "../../exceptions"

export const configDeleteArgs = {
  key: new StringParameter({
    help: "The key of the configuration variable",
    required: true,
  }),
}

export type DeleteArgs = ParameterValues<typeof configDeleteArgs>

// TODO: add --all option to remove all configs

export class ConfigDeleteCommand extends Command<typeof configDeleteArgs> {
  name = "delete"
  alias = "del"
  help = "Delete a configuration variable"

  arguments = configDeleteArgs

  async action(ctx: PluginContext, args: DeleteArgs) {
    const key = args.key.split(".")
    const res = await ctx.deleteConfig({ key })

    if (res.found) {
      ctx.log.info(`Deleted config key ${args.key}`)
    } else {
      throw new NotFoundError(`Could not find config key ${args.key}`, { key })
    }

    return { ok: true }
  }
}