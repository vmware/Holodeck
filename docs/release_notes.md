# Release Notes

This page documents the key features, enhancements, and capabilities available in Holodeck 9.1.

---

## Holodeck 9.1 – Major Release

**Release Date:** May 2026  
**Supported VCF Versions:** VCF 9.1.0.0, VCF 9.0.2.0, VCF 9.0.1.0, VCF 9.0.0.0, VCF 5.2.4, VCF 5.2.3, VCF 5.2.2, VCF 5.2.1, VCF 5.2  
**Minimum ESX Version:** 8.0 U3
<br>
**Release Blog:** [Announcing the General Availability of Holodeck 9.1](https://blogs.vmware.com/cloud-foundation/2026/07/01/announcing-the-general-availability-of-holodeck-9-1/)

### What's New

#### User-Facing Enhancements

##### New VCF Version Support
- **VCF 9.1.0.0**: Full support for deploying VCF 9.1.0.0 environments including all new VCF 9.1 capabilities
- **VVF 9.1.0.0**: Complete support for vSphere Foundation 9.1.0.0 deployments
- **VCF 5.2.4**: Added support for VCF 5.2.4 deployments

##### Enhanced Day 0 Operations (New-HoloDeckInstance)
- **New Version Support**: Added `"9.1.0.0"`, `"5.2.3"`, and `"5.2.4"` to the `-Version` parameter
- **Virtual Network Appliance (VNA) Support**: Holodeck now supports VNA cluster deployments for distributed networking capabilities along with existing support for Edge cluster deployments for centralized networking capabilities in both management and workload domains.

##### Enhanced Day 2 Operations (Update-HoloDeckInstance)
- **VCF Automation Support**: Deploy VCF Automation as a day 2 operation
- **Supervisor Support**: Deploy Supervisor as a day 2 operation in management or workload domain in distributed (VNA) or centralized (Edge) mode.
- **New Nested Host Support**: Add new nested ESX hosts as a day 2 Operation.
- **Same Interface**: Existing `-AdditionalCluster` and `-AddVcfAutomationAllAppsOrg` parameters work seamlessly with VCF 9.1

##### Enhanced New-HoloDeckConfig Behavior
- **Dual-Site Configuration**: Now automatically creates two configuration files - one for Site A and one for Site B
- **Automatic Site A Loading**: Site A configuration is automatically loaded into the PowerShell session by default
- **Streamlined Workflow**: Simplified dual-site deployment setup with automatic configuration management

##### Enhanced Import-HoloDeckConfig Capabilities  
- **New -Site Parameter**: Added mandatory `-Site` parameter to specify which site configuration to load
- **Required Site Selection**: You must specify the site using:
  ```powershell
  Import-HoloDeckConfig -ConfigId <id> -Site a    # For Site A (single or dual-site)
  Import-HoloDeckConfig -ConfigId <id> -Site b    # For Site B (dual-site only)
  ```
- **Enhanced Usability**: Streamlined configuration management for all deployment types

##### New Infrastructure Services
- **HashiCorp Vault**: Integrated secrets management service
  - Access at `https://<holorouter-ip>:8200` with root token `VMware123!VMware123!`
  - Automatically provisions certificates for all services
- **Authentik SSO**: Modern identity provider with single sign-on capabilities
  - Access at `https://<holorouter-ip>:9443` with credentials `admin` / `VMware123!VMware123!`
  - Supports SCIM for automated user provisioning
- **Technitium DNS**: Advanced DNS server with enhanced features
  - Access at `https://<holorouter-ip>:5380` with credentials `admin` / `VMware123!VMware123!`
  - Improved DNS performance and caching capabilities

##### HoloRouter OVA Enhancements
- **Webtop Authentication**: Webtop now requires authentication for improved security. Default credentials: `admin` / `VMware123!VMware123!`. Accessible on port 30000 of the HoloRouter management IP.
- **Enable GitOps**: When the HoloRouter OVA is deployed with GitOps enabled, **GitLab** is automatically installed and configured on HoloRouter. A GitLab repository pre-loaded with the Holodeck deployment pipeline is created, and HoloRouter is registered as a GitLab runner with the appropriate tags and parameters. This lets users trigger a complete Holodeck deployment directly from the GitLab UI — no manual PowerShell commands required.

##### Security Enhancements
- **HTTPS Everywhere**: All HoloRouter services now use HTTPS endpoints for secure communication via a built-in reverse proxy
- **Automated Certificates**: SSL certificates are automatically provisioned and managed for all services
- **Enhanced Authentication**: Improved authentication mechanisms across all services

#### Technical Infrastructure Improvements

##### Developer Mode Improvements
- **Enhanced Security**: Secure string handling for build tokens and credentials
- **Better Validation**: Comprehensive pre-checks for VCF 9.1 resource requirements
- **Improved Diagnostics**: Enhanced error reporting and troubleshooting capabilities

##### Infrastructure Backend Enhancements
- **Service State Management**: Improved tracking and management of all Holodeck operations
- **Enhanced Logging**: Consistent logging framework with structured error information
- **VCF Installer Validation**: Hardened validation to prevent deployment issues with patch files
- **Online Depot Support**: Enhanced support for VCF 9.1 online depot activation codes

#### Bug Fixes

- **Network Configuration**: Fixed VLAN range start parameter handling in network configuration functions
- **Site B Deployment**: Fixed various site B deployment issues including depot alias configuration and search path issues
- **Network Port Group Issues**: Resolved VCF Installer site B network port group configuration failures
- **Technitium DNS**: Fixed DNS lookup and configuration issues with Technitium DNS integration
- **Service Deployment**: Fixed various service deployment and management issues across the platform

---

## Holodeck 9.0.2 – Maintenance Release

**Release Date:** February 2026  
**Supported VCF Versions:** VCF 9.0.2.0, VCF 9.0.1.0, VCF 9.0.0.0, VCF 5.2.2, VCF 5.2.1, VCF 5.2  
**Minimum ESX Version:** 8.0 U3
<br>
**Release Blog:** [Announcing the General Availability of Holodeck 9.0.2.0](https://blogs.vmware.com/cloud-foundation/2026/03/05/announcing-the-general-availability-of-holodeck-9-0-2/)

### What's New

#### Enhancements

##### VCF Deployment-related Enhancements

- Added support for VCF 9.0.2.0 deployment
- VCF Installer version 9.0.2.0 can be used to deploy VCF 9.0.0.0, 9.0.1.0 and 9.0.2.0 environments.
- Introduced support for **Supervisor deployment in the management domain** via the new `-DeploySupervisorMgmtDomain` parameter. The previous `-DeploySupervisor` parameter has been renamed to `-DeploySupervisorWkldDomain`.
- Added support for **VCF Automation All Apps Org creation** as a Day 2 operation.
- New VCF Automation host protection logic added to protect the VCF Automation VM by ensuring no other VM runs on the same nested ESX host in the management domain.
- Added route redistribution for Transit Gateway in Management NSX Edge Cluster for VCF 9.0 by default.
- Introduced dedicated **error logging** to a separate error file under `/holodeck-runtime/logs/`, capturing detailed error diagnostics including stack traces, exception types, and full error records for easier troubleshooting.
- Automated HTTPS certificate trust establishment between the VCF Installer and the offline depot, including automated self-signed certificate import, for automated secure depot workflows.
- Added a precheck to ensure the IP provided for the offline depot is present in the depot certificate SAN to avoid trust establishment failures.
- Refactored depot setup code and added support for offline depot setup in **provision-only mode**.
- Automated bundle download retry on download failure in VCF Installer.
- Automated NSX Edge Cluster certificate expiry bug workaround from KB to prevent deployment failures for VCF 9.0.0.0 and 9.0.1.0.
- Added MasterCIDR validation to ensure only /20 CIDR blocks are used.
- Added guardrail for proxy protocol input — only uppercase (HTTP/HTTPS) is accepted to prevent VCF Installer API failures.
- Listed clusters and datastores alphabetically in pre-checks for easier selection.
- Added error handling for vCenter selected as target with no clusters created.
- Updated additional cluster deployments to use VDS MTU set to 8000.
- Added `allowLegacyCPU=true` persistently to both `boot.cfg` and `altbootbank/boot.cfg` for nested ESX hosts for supporting Legacy CPU use case.
- Removed default color-based instance naming; **InstanceID is now a mandatory parameter in `New-HoloDeckInstance`.**

##### Holorouter-related Enhancements

- Bookmarks and Passwords for nested VCF components added to Mozilla Firefox in webtop
- Split DNSMASQ into 3 DNS pods and 1 DHCP pod with CNI networking for improved DNS reliability and scalability on HoloRouter.
- Added AAAA query filtering for single site deployments to prevent DNS resolution timeouts.
- Enhanced service definitions for Webtop and DNSMASQ on HoloRouter.
- Fixed MTU on eth0 to 8000 on HoloRouter to resolve networking issues.
- Updated IP and hostname mappings

##### Cmdlet Enhancements

- **Multi-Version Support**: Holodeck now supports VCF 5.2, 5.2.1, 5.2.2, 9.0.0.0, 9.0.1.0 and 9.0.2.0. Please note that you need to upload ESX and VCF Installer (for 9.x) and Cloud Builder Appliance (for 5.2.x) versions in their respective folders at '/holodeck-runtime/bin' in HoloRouter.
- `New-HoloDeckInstance`: The `-Interactive` parameter has been removed. Day 2 operations are now handled by the new `Update-HoloDeckInstance` cmdlet. InstanceID is now a mandatory parameter. The `-DeploySupervisor` parameter has been renamed to `-DeploySupervisorWkldDomain` and a new `-DeploySupervisorMgmtDomain` parameter has been added for deploying Supervisor in the management domain.
- `Get-HoloDeckInstance`: Get details of the nested components deployed via New-HoloDeckInstance command
- `Update-HoloDeckInstance`: New cmdlet for performing Day 2 operations on Holodeck, replacing `New-HoloDeckInstance -Interactive`. Uses `-Site`, `-VIDomain`, and operation-specific flags (`-AdditionalCluster` or `-AddVcfAutomationAllAppsOrg`). This release supports deploying an All Apps Org in VCF Automation and deploying additional clusters in the VCF instance.
- `Start-HoloDeckInstance` / `Stop-HoloDeckInstance`: Updated to handle complex deployment types. `Stop-HoloDeckInstance` now implements proper power-off operations that gracefully shut down all nested VMs and VCF components in the correct order.
- `Get-HolodeckServiceIPPools`: New cmdlet that displays IP pool allocations used by all Holodeck services for easier network troubleshooting.

#### Bug Fixes

- Applied NSX Image validation workaround for deploying VCF 9.0.0.0 and VCF 9.0.1.0 using the 9.0.1.0 VCF Installer.
- Fixed offline depot authentication bug to properly support authenticated depot access.
- Fixed proxy protocol input in lowercase causing VCF Installer API failures — added guardrail to accept uppercase input only.
- Fixed typecasting bug in pre-check input for cluster and datastore selection when the list contains more than 10 values.
- Fixed developer mode bug for cluster and datacenter selection.
- Fixed state management issues for Day 2 operations.
- Fixed empty depot credentials being passed for HTTP depot configurations.
- Fixed `Set-HoloRouter -DualSite` issue caused by removal of hostname proxy from Site B lab standards.
- Fixed DNSMASQ service definition label causing service startup issues.
- Fixed additional cluster deployment workflow and site version selection.
- Fixed occasional issue where nested host NIC would get the wrong type assigned.
- Updated VCF Installer DNS and NTP entries to avoid warnings during deployment pre-checks.

### Known Issues

!!! note "Common Known Issues"
    - Hosts with memory tiering enabled may cause instability in nested workloads
    - vSAN ESA may consume more storage than expected due to nested deduplication/compression behavior

??? question "VVF 9.0.0.0 deployment fails when using VCF Installer 9.0.2.0 with 9.0.2 manifest files"

    Deploying VVF 9.0.0.0 using the VCF Installer 9.0.2.0 fails at the **"Generate Workload Domain Runtime Data Model"** step in VCF Installer UI with the error:

    ```
    Failed to generate add workload domain internal model specification
    Remediation: Please verify the commonsvcs and domainmanager services are running and retry
    ```

    This occurs due to a bug in VCF Installer 9.0.2.0 when using 9.0.2.0 manifest. VCF Installer expects vCenter 9.0.2.0 binary even though VVF 9.0.0.0 is being deployed. The installer reports `Got 0 install image(s) for product VCENTER` and fails to generate the workload domain model.

    **Workaround**

    Download the vCenter 9.0.2.0 bundle as well and resume the deployment.

??? question "VCF Automation All Apps Org IP Space uses hard-coded CIDR instead of custom CIDR"

    When deploying the All Apps Org in VCF Automation via the `Update-HoloDeckInstance` command with a **custom MasterCIDR** (e.g., `10.2.0.0/20`), the IP Spaces created in VCF Automation still use a `/28` subnet from the default `10.1.0.0/20` block instead of the custom CIDR. This is because the IP Space CIDR is hard-coded in the config file. Deployments using the default MasterCIDR (`10.1.0.0/20`) are not affected.

    **Workaround**

    1. With PowerShell open and the config loaded in the session, edit the config file:

        ```powershell
        vi $config.ConfigPath
        ```

    2. Locate the following key and update the CIDR value to match your custom subnet (e.g., `10.2.0.32/28`):

        ```
        "holodeck-sddc"."Site-A"."vcf-installer-management-domain"."vcfAutomationSpec"."allAppsOrgSpec"."networkingSpec"."ipSpaceCidr"
        ```

    3. Save and close the file, then reload the config:

        ```powershell
        Import-HoloDeckConfig -ConfigID <id>
        ```

    4. Run `Update-HoloDeckInstance` — it will use the corrected CIDR range for the IP Space.

??? question "DNS resolution fails during VCF deployment — hosts unreachable by hostname"

    During VCF deployment, the VCF Installer may fail to resolve nested ESX host FQDNs (e.g., `esx-01a.site-a.vcf.lab`), causing deployment failures. Hosts are reachable by IP address but `nslookup` returns **"connection refused"**.

    One of the reasons this could occur is when an **FQDN** (e.g., `cloudflare-dns.com`) is provided as the upstream DNS server instead of an **IP address** during HoloRouter setup.

    **Workaround**

    Provide an **IP address** (not an FQDN) as the upstream DNS server when setting up the HoloRouter.

    Track this issue here: [Community Discussion](https://community.broadcom.com/vmware-cloud-foundation/discussion/fail-to-deploy-vcf-9020)

??? question "VCF 5.2.x deployments fail at `Sync-HolodeckComponents` with 'No route to host' error"

    All VCF 5.2.x deployments complete the VCF deployment successfully, but the Holodeck script fails at the final **`Sync-HolodeckComponents`** step with an error such as `[ERROR] No route to host (opslcm-a.site-a.vcf.lab:443)`. This happens because `Sync-HolodeckComponents` attempts to query **VCF Operations**, which is not deployed in VCF 5.2.x environments.

    **Workaround**

    This error can be safely ignored — the VCF 5.2.x environment is fully deployed and functional.

---

## Holodeck 9.0.1 – Maintenance Release

**Release Date:** October 2025  
**Supported VCF Versions:** VCF 9.0.1.0, VCF 9.0.0.0, VCF 5.2.2, VCF 5.2.1, VCF 5.2  
**Minimum ESX Version:** 8.0 U3
<br>
**Release Blog:** [Announcing the General Availability of Holodeck 9.0.1.0](https://blogs.vmware.com/cloud-foundation/2025/10/21/announcing-the-general-availability-of-holodeck-9-0-1-0/)

### What's New

#### Enhancements

- Added support for VCF 9.0.1.0, including bypassing vSAN ESA check in VCF Installer and SDDC Manager.
- Added the capability to use custom VLAN ranges for Holodeck.
- Added the capability to use custom DNS domain for Holodeck.
- Enabled vCLS Retreat Mode for 9.0 clusters by default.
- Reduced the boot time for HoloRouter VM; bumped resources to 4 vCPUs and 8 GB memory.
- Enhanced support for special characters in target host credentials.
- Improved cluster selection logic for vCenter targets with multiple folder levels.
- Completed coverage for developer mode.

##### Cmdlet Enhancements

- **Multi-Version Support**: Holodeck now supports VCF 5.2, 5.2.1, 5.2.2, 9.0.0.0 and 9.0.1.0.
- `Remove-HoloDeckInstance`: New optional parameter to support automated deletion. User has 15 seconds to abort.
- `New-HoloDeckConfig`: Now validates the integrity of the `config.json` template.
- `Set-HoloDeckDNSConfig`: Removed the -update parameter. Behavior is now inferred from parameters provided.

#### Bug Fixes

- NSX Edge Cluster for Site B was trying to use BGP configuration from Site A. Fixed.
- VCF Installer for Site B was trying to get deployed in an incorrect VLAN. Fixed.
- Online depot connection check was failing due to incorrect API response expected. Fixed.
- Fixed DNSMASQ configuration to not respond to AAAA queries that caused nslookup commands to time out.

### Known Issues

!!! note "Common Known Issues"
    - Hosts with memory tiering enabled may cause instability in nested workloads
    - vSAN ESA may consume more storage than expected due to nested deduplication/compression behavior

??? question "VCF 9.0.x Deployment fails on step 'Validate NSX Install Image is Available'"

    **Fixed in:** Holodeck 9.0.2

    Track this issue here: [GitHub Issue #89](https://github.com/vmware/Holodeck/issues/89)

??? question "NSX Edge deployment fails due to expired OVF certificate"

    **Fixed in:** Holodeck 9.0.2

    Track this issue here: [GitHub Issue #86](https://github.com/vmware/Holodeck/issues/86)

---

## Holodeck 9.0 – Initial Release

**Release Date:** June 2025  
**Supported VCF Versions:** VCF 9.0, VCF 5.2.x  
**Minimum ESX Version:** 8.0 U3
<br>
**Release Blog:** [Announcing the General Availability of Holodeck 9.0](https://blogs.vmware.com/cloud-foundation/2025/06/30/announcing-the-general-availability-of-holodeck-9-0/)

### What's New

#### Enhancements

- Support for both **VCF 9.0** and **VCF 5.2** deployments from a single toolkit
- **vSAN ESA and OSA** deployment options
- New **VVF deployment mode** (VMware vSphere Foundation)
- Proxy support for online/offline depot workflows
- Enhanced PowerShell cmdlets with modular support:
  - `New-HoloDeckConfig`, `New-HoloDeckInstance`, `Start-HoloDeckInstance`, `Stop-HoloDeckInstance`
- Option to deploy **greenfield** VCF environments with **provision-only mode**

### Known Issues

!!! note "Common Known Issues"
    - Hosts with memory tiering enabled may cause instability in nested workloads
    - vSAN ESA may consume more storage than expected due to nested deduplication/compression behavior

---

## Reporting Issues

To raise issues, feature requests, or provide feedback, please visit the [Holodeck GitHub repository](https://github.com/vmware/Holodeck/issues).
