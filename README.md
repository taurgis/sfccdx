
# SFCCDX (Salesforce Commerce Cloud Developer Experience)

Salesforce Commerce Cloud Developer Experience is a command line interface (CLI) for Salesforce Commerce Cloud. It can be used to easily move metadata from and to your environment.

The CLI can be used from any machine either locally or from build tools, like Jenkins, Travis CI, Bitbucket Pipelines, Heroku CI etc.

Not sure where to start? Check out the [Use Cases](https://github.com/taurgis/sfccdx/wiki/Use-Cases) section.

# Roadmap
Want to help out? Checkout the [roadmap](https://github.com/taurgis/sfccdx/projects/1)!

# Known Limitations
There are limitations to the OCAPI, and those that affect this tool have been documented [here](https://github.com/taurgis/sfccdx/wiki/Known-Limitations).

# Required config files
The dw.json file needs to be present in the project root.

## dw.json
The standard **dw.json** file is used to determine the hostname.

```json
{
    "hostname": "dev05-eu01-multipharma.demandware.net",
    "username": "user",
    "password": "password",
    "client-id": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    "client-secret": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
}

```

# Business Manager
## OCAPI Configuration (Data)
Since we are making use of the OCAPI Data Resources, your configured Client ID needs access to these resources.
<br/><br/>
<details>
<summary>View JSON example</summary>

```json
{
	"_v": "21.10",
	"clients": [
		{
			"client_id": "<YOUR-CLIENT-ID-HERE>",
			"resources": [
				{
					"resource_id": "/system_object_definitions",
					"methods": [
						"get"
					],
					"read_attributes": "(**)",
					"write_attributes": "(**)"
				},
				{
					"resource_id": "/system_object_definitions/*",
					"methods": [
						"get"
					],
					"read_attributes": "(**)",
					"write_attributes": "(**)"
				},
				{
					"resource_id": "/system_object_definitions/*/attribute_definitions",
					"methods": [
						"get"
					],
					"read_attributes": "(**)",
					"write_attributes": "(**)"
				},
				{
					"resource_id": "/system_object_definitions/*/attribute_definitions/*",
					"methods": [
						"delete",
						"get",
						"patch",
						"put"
					],
					"read_attributes": "(**)",
					"write_attributes": "(**)"
				},
				{
					"resource_id": "/system_object_definitions/*/attribute_groups",
					"methods": [
						"get"
					],
					"read_attributes": "(**)",
					"write_attributes": "(**)"
				},
				{
					"resource_id": "/system_object_definitions/*/attribute_groups/*/attribute_definitions/*",
					"methods": [
						"delete",
						"put"
					],
					"read_attributes": "(**)",
					"write_attributes": "(**)"
				},
				{
					"resource_id": "/system_object_definitions/*/attribute_groups/*",
					"methods": [
						"delete",
						"get",
						"patch",
						"put"
					],
					"read_attributes": "(**)",
					"write_attributes": "(**)"
				}
			]
		}
	]
}
```
</details>
<br/>

# Using the Command Line Interface

```powershell
Usage: sfccdx [options] [command]

Options:
  -V, --version               output the version number
  -h, --help                  display help for command

Commands:
  environment [options]       Attempts to read the current configuration either through the CLI, the dw.json & ocapi.json configuration file, or a
                              combination (overriding the JSON via the CLI)
  verify [options]                            Verifies the B2C Commerce environment by making an authorization call.
  attribute:get [options]                     Fetch all information about a given standard or custom attribute.
  attribute:delete [options]                  Delete a custom attribute on an object.
  attribute:push [options]                    Push a custom attribute to an object.
  attributegroup:get [options]                Fetch all information about a given Attribute Group.
  attributegroup:delete [options]             Delete a Attribute Group from an object.
  attributegroup:push [options]               Push a Attribute Group to an object.
  attributegroup:assignment:delete [options]  Delete a Attribute Group assignment.
  help [command]                              display help for command.
  ```
  
