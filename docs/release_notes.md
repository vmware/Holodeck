# Release Notes

This page documents the key features, enhancements, and capabilities available in Holodeck releases.

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
- Updated CPU requirements for VCF Automation with vSAN ESA (min. 32 vCPUs) and vSAN OSA (min. 24 vCPUs).
- Added the capability to use custom VLAN ranges (sequential per site) for Holodeck and the users can specify the start of the custom VLAN range while deploying Holodeck
- Added the capability to use custom DNS domain for Holodeck by specifying it while deploying Holodeck
- Enabled vCLS Retreat Mode for 9.0 clusters by default.
- Custom vSAN HCL now in-built into Cloud Builder and VCF Installer for Dark Site deployments.
- Added user input for offline depot protocol (HTTP/HTTPS) and port flexibility.
- Implemented prechecks for proper offline depot configuration and file availability.
- Ability to select unique port group during prechecks for each site during dual site deployment.
- Reduced the boot time for HoloRouter VM
- Bumped up the resources on HoloRouter - it now uses 4 vCPUs and 8GB of memory
- Enhanced support for special characters in target host credentials.
- Improved cluster selection logic for vCenter targets with multiple folder levels.
- Added support for partial host commissioning during workload domain creation retries.
- Implemented additional guardrails for target disconnections to prevent errors.
- Improved idempotency for NSX Edge Cluster deployment retries.
- Introduced case sensitivity for input parameters to avoid issues.
- Improved error handling and cleaner code exits.
- Reduced CIDR size for VPC from /24 to /28 to free up IPs.
- Completed coverage for developer mode.
- Added error handling for unsupported targets (standalone ESX managed by vC).
- Provided default username and password values for optional offline depot authentication.
- Removed misleading "must support https" message from offline depot input.
- Improved idempotency for New-HolodeckNetworkConfig cmdlet
- Added access to HoloRouter's /holodeck-runtime/specs/ folder in webtop
- Moved iptables from startup_script to ip4save to avoid duplicate entries
- Configured HoloRouter to drop all inbound traffic on eth0 except on the ports with services enabled
- Improved error handling for Network Manager

##### Cmdlet Enhancements

- **Multi-Version Support**: Holodeck now supports VCF 5.2, 5.2.1, 5.2.2, 9.0.0.0 and 9.0.1.0. Please note that you need to upload ESX and VCF Installer (for 9.x) and Cloud Builder Appliance (for 5.2.x) versions in their respective folders at '/holodeck-runtime/bin' in holorouter.
- `Remove-HoloDeckInstance`: This cmdlet has a new optional parameter to support the automated deletion of the holodeck instance. If not specified, then the instance ID will be captured from the global config file. Also, the prompt for user confirmation is removed; instead, the user will have 15 seconds to abort the operation by pressing any key on the console.
- `New-HoloDeckConfig`: This cmdlet now validates the integrity of the `config.json` template. If the template file's integrity does not match, the user will see a warning before a new config file is created for the Holodeck instance.
- `Set-HoloDeckDNSConfig`: Removed the -update parameter. If the user specifies -DNSRecord, it will create a new record. If the user specifies -SearchDNSRecord and -ReplaceDNSRecord, it will update the DNS record.
- **DNS Cmdlets**: Removed the -ConfigPath parameter from all DNS cmdlets. It will now use the global $config.

#### Bug Fixes

- NSX Edge Cluster for Site B was trying to use BGP configuration from Site A. Fixed it to use Site B BGP configuration.
- VCF Installer for Site B was trying to get deployed in an incorrect VLAN. Fixed this.
- Online depot connection check was failing due to incorrect API response expected in the code. Fixed.
- Fixed DNSMASQ configuration to not respond to AAAA queries that caused nslookup commands to time out.
- Fixed iptables to not lose SSH and Webtop access on HoloRouter reboot.
- Fixed the issue in configuring DNSMASQ as primary DNS server in HoloRouter when HoloRouter uses DHCP.

### Known Issues

!!! note "Common Known Issues"
    - Hosts with memory tiering enabled may cause instability in nested workloads
    - vSAN ESA may consume more storage than expected due to nested deduplication/compression behavior

??? question "VCF 9.0.x Deployment fails on step 'Validate NSX Install Image is Available'"

    When deploying VCF 9.0.0.0 or 9.0.1.0, the deployment fails on the step **"Validate NSX Install Image is Available"**.

    **Workaround**

    1. Download the **VCF Installer** files for **9.0.2.0**.
    2. Copy the VCF Installer 9.0.2.0 files to the appropriate version folder on the HoloRouter.
    3. Update `/holodeck-runtime/templates/bom.json` to reflect the 9.0.2 VCF Installer file names.
    4. Run the VCF deployment again.

    **Fixed in:** Holodeck 9.0.2

    Track this issue here: [GitHub Issue #89](https://github.com/vmware/Holodeck/issues/89)

??? question "NSX Edge deployment fails due to expired OVF certificate"

    NSX Edge Cluster deployment fails with **"OVF certificate validation failed. Error: [VALIDATION_ERROR: CERTIFICATE_EXPIRED]"**.

    **Workaround**

    Follow the steps in [Broadcom KB 424034](https://knowledge.broadcom.com/external/article/424034).

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

---

## Reporting Issues

To raise issues, feature requests, or provide feedback, please visit the [Holodeck GitHub repository](https://github.com/vmware/Holodeck/issues).
