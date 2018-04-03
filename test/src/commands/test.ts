import { expect } from "chai"
import { makeTestContextA } from "../../helpers"
import { TestCommand } from "../../../src/commands/test"
import * as isSubset from "is-subset"

describe("commands.test", () => {
  it("should run all tests in a simple project", async () => {
    const ctx = await makeTestContextA()
    const command = new TestCommand()

    const result = await command.action(
      ctx,
      { module: undefined },
      { env: "local.test", group: undefined, force: true, "force-build": true },
    )

    expect(isSubset(result, {
      "build.module-a": {
        fresh: true,
        buildLog: "A\n",
      },
      "test.module-a.unit": {
        success: true,
        output: "OK\n",
      },
      "build.module-b": {
        fresh: true,
        buildLog: "B\n",
      },
      "build.module-c": {},
      "test.module-b.unit": {
        success: true,
        output: "OK\n",
      },
      "test.module-c.unit": {
        success: true,
        output: "OK\n",
      },
    })).to.be.true
  })

  it("should optionally test single module", async () => {
    const ctx = await makeTestContextA()
    const command = new TestCommand()

    const result = await command.action(
      ctx,
      { module: "module-a" },
      { env: "local.test", group: undefined, force: true, "force-build": true },
    )

    expect(isSubset(result, {
      "build.module-a": {
        fresh: true,
        buildLog: "A\n",
      },
      "test.module-a.unit": {
        success: true,
        output: "OK\n",
      },
    })).to.be.true
  })
})
