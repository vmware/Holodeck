## New-HoloDeckInstance

Creates a new HoloDeck instance — a nested VMware Cloud Foundation (VCF) lab environment for testing and training purposes.

```powershell
New-HoloDeckInstance -Version <String> [-InstanceID <String>] [-CIDR <String[]>] [-vSANMode <String>] [-LogLevel <String>] [-ProvisionOnly] -VVF [-Site <String>] [-DepotType <String>] [-DeveloperMode]

New-HoloDeckInstance -Version <String> [-InstanceID <String>] [-CIDR <String[]>] [-vSANMode <String>] -ManagementOnly [-NsxEdgeClusterMgmtDomain] [-DeployVcfAutomation] [-LogLevel <String>] [-ProvisionOnly] [-Site <String>] [-DepotType <String>] [-DeveloperMode]

New-HoloDeckInstance -Version <String> [-InstanceID <String>] [-CIDR <String[]>] [-vSANMode <String>] [-WorkloadDomainType <String>] [-NsxEdgeClusterMgmtDomain] [-NsxEdgeClusterWkldDomain] [-DeployVcfAutomation] [-DeploySupervisor] [-LogLevel <String>] [-ProvisionOnly] [-Site <String>] [-DepotType <String>] [-DeveloperMode]

New-HoloDeckInstance [-Interactive]
```

---

### Description

Deploys a HoloDeck instance based on the provided VCF version and optional parameters to customize the environment for management/workload domain, NSX Edge, vSAN mode, and more.

---

### Parameters

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| `-Version` | VCF version. Valid: `9.0.0.0` , `9.0.1.0` , `5.2` , `5.2.1` , `5.2.2` | ✅ | |
| `-InstanceID` | Optional prefix for all nested VMs | ❌ | Random |
| `-CIDR` | Custom /20 CIDR block (e.g., `"10.3.0.0/20"`). For Dual Site, provide in the format `["10.3.0.0/20","10.4.0.0/20"]` | ❌ | `10.1.0.0/20` |
| `-vSANMode` | vSAN type: `"ESA"` or `"OSA"` | ❌ | `OSA` |
| `-ManagementOnly` | Deploy only Management domain | ❌ | `False` |
| `-WorkloadDomainType` | `"SharedSSO"` or `"IsolatedSSO"` (VCF 5.2 only) | ❌ | `SharedSSO` |
| `-NsxEdgeClusterMgmtDomain` | Deploy NSX Edge Cluster in management domain | ❌ | `False` |
| `-NsxEdgeClusterWkldDomain` | Deploy NSX Edge Cluster in workload domain | ❌ | `False` |
| `-DeployVcfAutomation` | Deploy VCF Automation (VCF 9.x only) | ❌ | `False` |
| `-DeploySupervisor` | Deploy Supervisor (VCF 9.x only) | ❌ | `False` |
| `-Interactive` | Launch interactive mode for Day 2 ops | ❌ | `False` |
| `-LogLevel` | Log verbosity: `"INFO"`, `"DEBUG"`, etc. | ❌ | `INFO` |
| `-ProvisionOnly` | Provision ESX & CloudBuilder/VCF Installer only | ❌ | `False` |
| `-VVF` | Deploys a VVF instance | ❌ | |
| `-Site` | Site to deploy: `"a"` or `"b"` | ❌ | `a` |
| `-DepotType` | For VCF 9.0: `"Online"` or `"Offline"` | ❌ | `Online` |
| `-DeveloperMode` | Enables automated deployments using environment variables. | ❌ | `False` |

---

### Examples

 Example 1
 
Deploys a VVF using 9.0 version with vSAN ESA mode using default CIDR 10.1.0.0/20 and a randomly generated Instance ID
```powershell
New-HoloDeckInstance -Version 9.0.0.0 -vSANMode ESA -VVF -DepotType Online
```

 Example 2

Deploys a VCF 9.0 management domain with instance ID "holo" using a custom CIDR 10.3.0.0/20 with vSAN OSA and uses offline depot for VCF Installer.
```powershell
New-HoloDeckInstance -Version 9.0.0.0 -InstanceID holo -CIDR 10.3.0.0/20 -vSANMode OSA -ManagementOnly -NsxEdgeClusterMgmtDomain -DeployVcfAutomation -DepotType Offline
```

 Example 3

Deploys nested ESX hosts for management domain and VCF Installer and creates scripts available in /holodeck-runtime/specs/ folder to manually walk-through greenfield VCF deployment.
```powershell
New-HoloDeckInstance -Version 9.0.0.0 -InstanceID holo -CIDR 10.3.0.0/20 -vSANMode OSA -ManagementOnly -NsxEdgeClusterMgmtDomain -DeployVcfAutomation -ProvisionOnly
```

 Example 4

Deploys a VCF 9.0 full stack instance with NSX Edge cluster deployed in both management and workload domain, VCF Automation deployed in Management domain, supervisor deployed in workload domain using an online depot.
```powershell
New-HoloDeckInstance -Version 9.0.0.0 -NsxEdgeClusterMgmtDomain -NsxEdgeClusterWkldDomain -DeployVcfAutomation -DeploySupervisor -DepotType Online
```

 Example 5

Deploy additional cluster in management domain or workload domain after VCF instance has been deployed.
```powershell
New-HoloDeckInstance -Interactive
```

---

## Get-HoloDeckConfig

Retrieves HoloDeck configuration information.

```powershell
Get-HoloDeckConfig [-configID <String>]
```

---

### Description

Gets configuration details from HoloDeck config files. Can retrieve a specific configuration by ID or list all available configurations.

---

### Parameters

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| `-configID` | Optional configuration ID to retrieve a specific configuration | ❌ | |

---

### Examples

 Example 1

Returns all available HoloDeck configurations
```powershell
Get-HoloDeckConfig
```

 Example 2

Returns the configuration details for the "prod" configuration
```powershell
Get-HoloDeckConfig -configID "prod"
```

---

### Notes

Configurations are stored in the `/holodeck-runtime/config` directory.

---

## New-HoloDeckConfig

Creates a new HoloDeck configuration file.

```powershell
New-HoloDeckConfig -TargetHost <String> -UserName <String> -Password <String> [-Description <String>] [-Default]
```

---

### Description

Initializes a new HoloDeck configuration with target host details, credentials, and optional description. Can create a default configuration or a custom one.

---

### Parameters

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| `-TargetHost` | The hostname or IP address of the target vCenter or ESX host | ✅ | |
| `-UserName` | Username for authenticating to the target host | ✅ | |
| `-Password` | Password for authenticating to the target host | ✅ | |
| `-Description` | Optional description | ❌ | |
| `-Default` | Switch to create a default configuration | ❌ | `False` |

---

### Examples

 Example 1

Creates a new configuration for a production environment
```powershell
New-HoloDeckConfig -TargetHost "vcenter.example.com" -UserName "admin" -Password "pass" -Description "Production environment"
```

 Example 2

Creates a new default configuration
```powershell
New-HoloDeckConfig -TargetHost "vcenter.example.com" -UserName "admin" -Password "pass" -Default
```

---

### Notes

The configuration is saved to `/holodeck-runtime/config` directory.

---

## Import-HoloDeckConfig

Imports and loads a HoloDeck configuration.

```powershell
Import-HoloDeckConfig -ConfigID <String>
```

---

### Description

Loads a specific HoloDeck configuration file by ConfigID into the global `$config` variable for use by other HoloDeck functions.

---

### Parameters

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| `-ConfigID` | The configuration ID to import | ✅ | |

---

### Examples

 Example 1

Imports the configuration with ID "abc123"
```powershell
Import-HoloDeckConfig -ConfigID "abc123"
```

---

### Notes

Sets the global `$config` variable with the imported configuration.

---

## Reset-HoloDeckState

Resets the HoloDeck state file to empty.

```powershell
Reset-HoloDeckState
```

---

### Description

Clears all state information from the HoloDeck state file by setting its contents to null. Used to start fresh or clear corrupted state.

---

### Examples

 Example 1

Resets the state file to empty, clearing all tracked function states
```powershell
Reset-HoloDeckState
```

---

### Notes

This operation cannot be undone. All state tracking information will be lost.

---

## Get-HoloDeckDNSConfig

Retrieves DNS records from the HoloDeck DNS configuration.

```powershell
Get-HoloDeckDNSConfig [-IP <String>] [-FQDN <String>]
```

---

### Description

Queries the CoreDNS ConfigMap for DNS records. Can filter by IP address, FQDN, or retrieve all records.

---

### Parameters

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| `-IP` | Optional IP address to filter DNS records | ❌ | |
| `-FQDN` | Optional FQDN to filter DNS records | ❌ | |

---

### Examples

 Example 1

Retrieves all DNS records
```powershell
Get-HoloDeckDNSConfig
```

 Example 2

Retrieves DNS records for the specified IP address
```powershell
Get-HoloDeckDNSConfig -IP "192.168.1.10"
```

 Example 3

Retrieves DNS records for the specified FQDN
```powershell
Get-HoloDeckDNSConfig -FQDN "server.example.com"
```

---

## New-HoloDeckNetworkConfig

Generates network configuration for HoloDeck deployment.

```powershell
New-HoloDeckNetworkConfig -MasterCIDR <String> [-NoOfSubnets <String>] [-bgpPassword <String>] [-Site <String>] [-VLANRangeStart <String>] [-DNSDomain <String>]
```

---

### Description

Creates a comprehensive network configuration including subnets, VLANs, IP pools, and BGP configuration. Supports custom network layouts or default configurations. Generates configuration for ESXi hosts, vCenter, NSX, and other VCF components.

---

### Parameters

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| `-MasterCIDR` | The master CIDR block to subdivide into subnets (e.g., "10.1.0.0/20") | ✅ | |
| `-NoOfSubnets` | Number of subnets to create | ❌ | `29` |
| `-bgpPassword` | BGP password for routing configuration | ❌ | |
| `-Site` | Site identifier (a or b) | ❌ | `a` |
| `-VLANRangeStart` | Starting VLAN ID for VLAN assignment | ❌ | |
| `-DNSDomain` | DNS domain suffix | ❌ | `vcf.lab` |

---

### Examples

 Example 1

Creates default network configuration for Site A using the specified CIDR
```powershell
New-HoloDeckNetworkConfig -MasterCIDR "192.168.0.0/16" -Site "a"
```

 Example 2

Creates custom network configuration with 40 subnets starting at VLAN 100
```powershell
New-HoloDeckNetworkConfig -MasterCIDR "10.0.0.0/16" -NoOfSubnets 40 -VLANRangeStart 100 -Site "b"
```

---

## Get-HoloDeckBGPConfig

Retrieves BGP configuration information from HoloDeck network configuration.

```powershell
Get-HoloDeckBGPConfig [-Site <String>]
```

---

### Description

Queries the network configuration YAML file for BGP (Border Gateway Protocol) settings including router AS numbers, Edge AS numbers for management and workload domains, and BGP password. This information is used to configure BGP routing between the HoloRouter and NSX Edge nodes.

---

### Parameters

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| `-Site` | Site identifier (a or b) | ❌ | `a` |

---

### Examples

 Example 1

Retrieves BGP configuration for Site A
```powershell
Get-HoloDeckBGPConfig -Site "a"
```

---

## Set-HoloRouter

Configures the HoloRouter for network routing and DNS services.

```powershell
Set-HoloRouter [-dualsite] [-CIDR <String[]>]
```

---

### Description

Sets up the HoloRouter virtual appliance with DNSMASQ for DNS services, FRR for BGP routing, and VLAN configurations. Supports both single-site and dual-site deployments. 

---

### Parameters

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| `-dualsite` | Switch to configure HoloRouter for dual-site deployment with separate VRF (Virtual Routing and Forwarding) tables for each site | ❌ | `False` |
| `-CIDR` | Array of CIDR blocks. Used to specify custom network ranges that need to be routed through the HoloRouter | ❌ | |

---

### Examples

 Example 1

Configures HoloRouter for single-site deployment with default settings
```powershell
Set-HoloRouter
```

 Example 2

Configures HoloRouter for dual-site deployment with VRF separation
```powershell
Set-HoloRouter -dualsite
```

 Example 3

Configures HoloRouter with custom CIDR blocks for routing
```powershell
Set-HoloRouter -CIDR ["10.0.0.0/16","192.168.0.0/16"]
```

---

## Reset-HoloRouter

Resets and removes HoloRouter configuration.

```powershell
Reset-HoloRouter
```

---

### Description

Uninstalls and removes all HoloRouter components including DNSMASQ DNS services, FRR BGP routing, and associated network configurations. Reverts network settings to their original state by removing VLANs, VRF tables, and custom routing rules. Restores the original DNS configuration on the HoloRouter appliance.

---

### Examples

 Example 1

Removes all HoloRouter configuration and services
```powershell
Reset-HoloRouter
```

---

### Notes

This operation removes critical infrastructure services. Use with caution as it will disable DNS and routing services for the HoloDeck environment. HoloRouter will need to be reconfigured with `Set-HoloRouter` after running this function. Requires appropriate permissions to modify Kubernetes resources and network settings.

---

## Get-HoloDeckAppNetwork

Retrieves application network information from HoloDeck network configuration.

```powershell
Get-HoloDeckAppNetwork [-Hostname <String>] [-IP <String>] [-FQDN <String>] [-Site <String>]
```

---

### Description

Queries the network configuration YAML file for application network details including hostname, IP address, and FQDN mappings. Can filter results by hostname, IP, FQDN, or retrieve all entries for a specific site.

---

### Parameters

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| `-Hostname` | Optional hostname to filter the results | ❌ | |
| `-IP` | Optional IP address to filter the results | ❌ | |
| `-FQDN` | Optional fully qualified domain name to filter the results | ❌ | |
| `-Site` | Site identifier (a or b) | ❌ | `a` |

---

### Examples

 Example 1

Retrieves all application network entries for Site A
```powershell
Get-HoloDeckAppNetwork -Site "a"
```

 Example 2

Retrieves network information for the vcenter host in Site B
```powershell
Get-HoloDeckAppNetwork -Hostname "vcenter" -Site "b"
```

 Example 3

Retrieves network information for the specified IP in Site A
```powershell
Get-HoloDeckAppNetwork -IP "192.168.1.10" -Site "a"
```

---

## Get-HoloDeckSubnet

Retrieves subnet configuration information from HoloDeck network configuration.

```powershell
Get-HoloDeckSubnet [-Name <String>] [-vlanID <String>] [-Subnet <String>] [-Gateway <String>] [-Site <String>]
```

---

### Description

Queries the network configuration YAML file for subnet details including subnet name, VLAN ID, subnet CIDR, and gateway information. Can filter results by various subnet properties or retrieve all subnets for a site.

---

### Parameters

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| `-Name` | Optional subnet name to filter the results (e.g., "mgmt-a", "vmotion-a") | ❌ | |
| `-vlanID` | Optional VLAN ID to filter the results | ❌ | |
| `-Subnet` | Optional subnet CIDR to filter the results (e.g., "192.168.1.0/24") | ❌ | |
| `-Gateway` | Optional gateway IP address to filter the results | ❌ | |
| `-Site` | Site identifier (a or b) | ❌ | `a` |

---

### Examples

 Example 1

Retrieves all subnet configurations for Site A
```powershell
Get-HoloDeckSubnet -Site "a"
```

 Example 2

Retrieves the management subnet configuration for Site A
```powershell
Get-HoloDeckSubnet -Name "mgmt-a" -Site "a"
```

 Example 3

Retrieves subnet information for VLAN 100 in Site B
```powershell
Get-HoloDeckSubnet -vlanID "100" -Site "b"
```

---

## Get-HoloDeckOverlaySubnet

Retrieves overlay subnet configuration information from HoloDeck network configuration.

```powershell
Get-HoloDeckOverlaySubnet [-Name <String>] [-Subnet <String>] [-Gateway <String>] [-Site <String>]
```

---

### Description

Queries the network configuration YAML file for NSX overlay subnet details. Overlay subnets are used for NSX overlay networking, including GENEVE tunnels, overlay-backed segments, and overlay transport zones. Can filter results by subnet name, CIDR, or gateway.

---

### Parameters

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| `-Name` | Optional overlay subnet name to filter the results | ❌ | |
| `-Subnet` | Optional overlay subnet CIDR to filter the results (e.g., "10.0.0.0/16") | ❌ | |
| `-Gateway` | Optional gateway IP address to filter the results | ❌ | |
| `-Site` | Site identifier (a or b) | ❌ | `a` |

---

### Examples

 Example 1

Retrieves all overlay subnet configurations for Site A
```powershell
Get-HoloDeckOverlaySubnet -Site "a"
```

 Example 2

Retrieves the overlay transport zone subnet for Site A
```powershell
Get-HoloDeckOverlaySubnet -Name "overlay-tz-a" -Site "a"
```

 Example 3

Retrieves overlay subnet information for the specified CIDR in Site B
```powershell
Get-HoloDeckOverlaySubnet -Subnet "10.0.0.0/16" -Site "b"
```

---

## Get-HoloDeckAppIpPools

Retrieves application IP pool information from HoloDeck network configuration.

```powershell
Get-HoloDeckAppIpPools [-Site <String>] [-Name <String>] [-ipPool <String>]
```

---

### Description

Queries the network configuration YAML file for application IP pool definitions. IP pools are used for allocating IP addresses to VCF appliances and components such as vCenter, NSX managers, SDDC Manager, and other infrastructure services. Can filter results by pool name, IP pool range, or retrieve all pools for a site.

---

### Parameters

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| `-Site` | Site identifier (a or b) | ❌ | `a` |
| `-Name` | Optional IP pool name to filter the results (e.g., "vcenter-pool", "nsx-pool") | ❌ | |
| `-ipPool` | Optional IP pool range to filter the results (e.g., "192.168.1.10-192.168.1.20") | ❌ | |

---

### Examples

 Example 1

Retrieves all application IP pool configurations for Site A
```powershell
Get-HoloDeckAppIpPools -Site "a"
```

 Example 2

Retrieves the vCenter IP pool configuration for Site A
```powershell
Get-HoloDeckAppIpPools -Name "vcenter-pool" -Site "a"
```

 Example 3

Retrieves IP pool information for the specified range in Site B
```powershell
Get-HoloDeckAppIpPools -ipPool "192.168.1.10-192.168.1.20" -Site "b"
```