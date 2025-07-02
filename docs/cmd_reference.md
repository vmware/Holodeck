## New-HoloDeckInstance

Creates a new HoloDeck instance — a nested VCF lab as a proof of concept for VCF.

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
| `-Version` | VCF version. Valid: `"9.0"` or `"5.2"` | ✅ | |
| `-InstanceID` | Optional prefix for all nested VMs | ❌ | Random |
| `-CIDR` | Custom /20 CIDR block (e.g., `"10.3.0.0/20"`) | ❌ | `10.1.0.0/20` |
| `-vSANMode` | vSAN type: `"ESA"` or `"OSA"` | ❌ | `OSA` |
| `-ManagementOnly` | Deploy only Management domain | ❌ | `False` |
| `-WorkloadDomainType` | `"SharedSSO"` or `"IsolatedSSO"` (VCF 5.2 only) | ❌ | `SharedSSO` |
| `-NsxEdgeClusterMgmtDomain` | Deploy NSX Edge in management domain | ❌ | `False` |
| `-NsxEdgeClusterWkldDomain` | Deploy NSX Edge in workload domain | ❌ | `False` |
| `-DeployVcfAutomation` | Deploy VCF Automation (VCF 9.0 only) | ❌ | `False` |
| `-DeploySupervisor` | Deploy Supervisor (VCF 9.0 only) | ❌ | `False` |
| `-Interactive` | Launch interactive mode for Day 2 ops | ❌ | `False` |
| `-LogLevel` | Log verbosity: `"INFO"`, `"DEBUG"`, etc. | ❌ | `INFO` |
| `-ProvisionOnly` | Provision ESX & CloudBuilder only | ❌ | `False` |
| `-VVF` | Deploys a VVF instance | ✅ | |
| `-Site` | Site to deploy: `"a"` or `"b"` | ❌ | `a` |
| `-DepotType` | For VCF 9.0: `"Online"` or `"Offline"` | ❌ | `Online` |
| `-DeveloperMode` | Internal use only | ❌ | `False` |

---

### Examples

 Example 1
 
Deploys a VVF using 9.0 version with vSAN ESA mode using default CIDR 10.1.0.0/20 and a randomly generated Instance ID
```powershell
New-HoloDeckInstance -Version 9.0 -vSANMode ESA -VVF -DepotType Online
```

 Example 2

Deploys a VCF 9.0 management domain with instance ID "holo" using a custom CIDR 10.3.0.0/20 with vSAN OSA and uses offline depot for VCF Installer.
```powershell
New-HoloDeckInstance -Version 9.0 -InstanceID holo -CIDR 10.3.0.0/20 -vSANMode OSA -ManagementOnly -NsxEdgeClusterMgmtDomain -DeployVcfAutomation -DepotType Offline
```

 Example 3

Deploys nested ESX hosts for management domain and VCF Installer and creates scripts available in /holodeck-runtime/specs/ folder to manually walk-through greenfield VCF deployment.
```powershell
New-HoloDeckInstance -Version 9.0 -InstanceID holo -CIDR 10.3.0.0/20 -vSANMode OSA -ManagementOnly -NsxEdgeClusterMgmtDomain -DeployVcfAutomation -ProvisionOnly
```

 Example 4

Deploys a VCF 9.0 full stack instance with NSX Edge cluster deployed in both management and workload domain, VCF Automation deployed in Management domain, supervisor deployed in workload domain using an online depot.
```powershell
New-HoloDeckInstance -Version 9.0 -NsxEdgeClusterMgmtDomain -NsxEdgeClusterWkldDomain -DeployVcfAutomation -DeploySupervisor -DepotType Online
```

 Example 5

Deploy additional cluster in management domain or workload domain after VCF instance has been deployed.
```powershell
New-HoloDeckInstance -Interactive
```