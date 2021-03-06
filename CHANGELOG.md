# Changelog
All notable changes to aws organization formation will be documented in this file.

**version 0.0.67**
- Added support for empty/null bindings.
- Added Fn:TargetCount function which returns the amount of target for a binding. Can be used in Conditions, e.g: CreateResoruce: !Not [ !Equals [ Fn:TargetCount MyBinding, 0 ] ]

**version 0.0.65**
- Fixed issue where account creation had to be retried after timing issue accessing the account for the first time.
- When calling org-formation without args it will display help.

**version 0.0.64**
- Improved logic to select resource in cross target !Ref. If target resource exists in same account but different region AWSAccount.Resources.LogicalResourceId can now be used to refer to resource in different region.

**version 0.0.63**
- Fixed issue when deleting stacks state wasnt updated properly.

**version 0.0.62**
- Fixed issue with execute change set CLI command

**version 0.0.61**
- Added quite a bit of validation logic (notably to OrganizationalBindings and tasks)

**version 0.0.60**
- Ranamed Foreach to ForeachElement for resource foreach  (old attribute logs warning)

**version 0.0.59**
- Ranamed OrganizationBinding to DefaultOrganizationBinding in template (old attribute logs warning)
- Ranamed OrganizationBindingRegion to DefaultOrganizationBindingRegion in template (old attribute logs warning)
- Ranamed OrganizationBinding to DefaultOrganizationBinding in update-stack tasks (old attribute logs warning)
- Ranamed OrganizationBindingRegion to DefaultOrganizationBindingRegion in update-stack tasks (old attribute logs warning)

**version 0.0.58**
- Support for cross account dependencies with conditions (condition gets copied to export)

**version 0.0.56**
- Support for qouted expressions in EnumTargetRegions and EnumTargetAccounts, e.g. Fn::EnumTargetAccounts RoleAccountBinding 'arn:aws:iam::${account}:role/DeveloperRole'
- Support for adding OrganizationBindings in update-stack tasks.

**version 0.0.55**
- Support for toplevel OrganizationBindings section to list organization bindings
- Changed EnumTargetAccounts and EnumTargetRegions to only work with organization bindings from OrganizationBindings section

**version 0.0.54**
- Fixed issue with explicit cross account !Ref and !GetAtt to local account (e.g. !GetAtt AWSAccount.Resources.Topic.arn)

**version 0.0.53**
- Made --stack-name option optional on validate-stack and print-stack.
- Added --parameters option to print-stacks command. Doesnt really do anything but allows you to use the same options on validate-stack and print-stack.

**version 0.0.52**
- Added --parameters option to validate-stacks command.

**version 0.0.51**
- When running perform-tasks, having an update-organization task is now required. The organization file will be re-used and must be consistent with other tasks.

**version 0.0.50**
- Fixed a bug where cross account export values that were resolved where re-used on multiple target parameters

**version 0.0.49**
- Added validate tasks command (org-formation validate-tasks <task-file>)

**version 0.0.48**
- Added validate stacks command (org-formation validate-stacks <template-file>)
- Init-pipeline now reuses state bucket if already present.

**version 0.0.47**
- Fixed an issue where stacks wouldnt be able to get deleted after the account was closed. Stacks will now be forgotten if deletion fails.
