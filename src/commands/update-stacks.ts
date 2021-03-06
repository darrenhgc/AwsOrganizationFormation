import { Command } from 'commander';
import { CloudFormationBinder } from '../cfn-binder/cfn-binder';
import { CfnTaskRunner } from '../cfn-binder/cfn-task-runner';
import { ConsoleUtil } from '../console-util';
import { OrgFormationError } from '../org-formation-error';
import { IOrganizationBinding, ITemplateOverrides, TemplateRoot } from '../parser/parser';
import { BaseCliCommand, ICommandArgs } from './base-command';

const commandName = 'update-stacks <templateFile>';
const commandDescription = 'update cloudformation resources in accounts';

export class UpdateStacksCommand extends BaseCliCommand<IUpdateStacksCommandArgs> {

    public static async Perform(command: IUpdateStacksCommandArgs) {
        const x = new UpdateStacksCommand();
        await x.performCommand(command);
    }

    public static createTemplateUsingOverrides(command: IUpdateStacksCommandArgs, templateFile: string) {
        const templateOverrides: ITemplateOverrides = {};

        if (command.stackDescription) {
            templateOverrides.Description = command.stackDescription;
        }
        if (command.defaultOrganizationBinding) {
            templateOverrides.DefaultOrganizationBinding = command.defaultOrganizationBinding;
        }
        if (command.defaultOrganizationBindingRegion) {
            templateOverrides.DefaultOrganizationBindingRegion = command.defaultOrganizationBindingRegion;
        }
        if (command.organizationFile) {
            templateOverrides.OrganizationFile = command.organizationFile;
        }
        if (command.organizationFile) {
            templateOverrides.OrganizationBindings = command.organizationBindings;
        }
        const template = TemplateRoot.create(templateFile, templateOverrides, command.organizationFileHash);
        return template;
    }

    constructor(command?: Command) {
        super(command, commandName, commandDescription, 'templateFile');
    }

    public addOptions(command: Command) {
        command.option('--stack-name <stack-name>', 'name of the stack that will be used in cloudformation');
        command.option('--stack-description [description]', 'description of the stack that will be displayed cloudformation');
        command.option('--parameters [parameters]', 'parameter values passed to cloudformation when executing stacks');
        command.option('--termination-protection', 'value that indicates whether stack must have deletion protection');
        super.addOptions(command);
    }

    public async performCommand(command: IUpdateStacksCommandArgs) {
        if (!command.stackName) {
            throw new OrgFormationError(`argument --stack-name is missing`);
        }

        const terminationProtection = command.terminationProtection === true;
        const stackName = command.stackName;
        const templateFile = command.templateFile;

        const template = UpdateStacksCommand.createTemplateUsingOverrides(command, templateFile);
        const parameters = this.parseStackParameters(command.parameters);
        const state = await this.getState(command);
        const cfnBinder = new CloudFormationBinder(stackName, template, state, parameters, terminationProtection);

        const cfnTasks = cfnBinder.enumTasks();
        if (cfnTasks.length === 0) {
            ConsoleUtil.LogInfo(`stack ${stackName} already up to date.`);
        } else {
            try {
                await CfnTaskRunner.RunTasks(cfnTasks, stackName);
            } finally {
                await state.save();
            }
            ConsoleUtil.LogInfo('done');
        }

    }
}

export interface IUpdateStacksCommandArgs extends ICommandArgs {
    organizationFile?: string;
    organizationFileHash?: string;
    defaultOrganizationBindingRegion?: any;
    defaultOrganizationBinding?: any;
    organizationBindings?: Record<string, IOrganizationBinding>;
    templateFile: string;
    stackName: string;
    stackDescription?: string;
    parameters?: string | {};
    terminationProtection?: boolean;
}
