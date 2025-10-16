# Release Notes

This page documents the key features, enhancements, and capabilities available in Holodeck releases.

---

## Holodeck 9.0.1 – Maintenance Release

**Release Date:** October 2025  
**Supported VCF Versions:** VCF 9.0.1.0, VCF 9.0.0.0, VCF 5.2.2, VCF 5.2.1, VCF 5.2  
**Minimum ESX Version:** 8.0 U3

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
- `New-HoloDeckConfig`: This cmdlet now validates the integrity of the `config.json` template. If the template file’s integrity does not match, the user will see a warning before a new config file is created for the Holodeck instance. Ideally, users are not expected to modify the template config file; however, there may be edge cases where a customer chooses to do so. In such cases, the warning ensures they are informed of the change.
- `Set-HoloDeckDNSConfig`: Removed the -update parameter. If the user specifies -DNSRecord, it will create a new record. If the user specifies -SearchDNSRecord and -ReplaceDNSRecord, it will update the DNS record.
- **DNS Cmdlets**: Removed the -ConfigPath parameter from all DNS cmdlets. It will now use the global $config, which means users should ensure HolodeckConfig is imported in the session before running DNS cmdlets


#### Bug Fixes

- NSX Edge Cluster for Site B was trying to use BGP configuration from Site A. Fixed it to use Site B BGP configuration.
- VCF Installer for Site B was trying to get deployed in an incorrect VLAN. Fixed this.
- If NSX Edge Cluster creation task fails and another task populates in SDDC Manager, initiating retry gets stuck in an infinite loop. Fixed this to look for that specific task in SDDC Manager.
- Missing disconnection from target host was causing PowerCLI to list supervisors on the target sometimes instead of the nested vCenter. This has been fixed by adding a disconnection to target host before checking supervisor.
- Disabling vSAN HCL warning step was showcasing intermittent success and failure due to different object names for the warnings. Added error handling to ensure these errors are not thrown to the user.
- AVN deployment in 5.2 was failing due to an extra parameter being passed internally in the code. This has been fixed. AVN deployment is expected to proceed smoothly.
- Online depot connection check was failing due to incorrect API response expected in the code. This has been fixed. Online depot connection check should pass going forward.
- PreChecks was not looking at a specific cluster for ESX host version validation in case of multiple clusters when vCenter was selected as the target. Fixed this behavior.
- VVF deployment failure due to 4 host entries in spec file instead of 3. Fixed.
- Dual Site VVF data was not properly configured for Site B. Fixed.
- Dual site if executed serially was skipping over Site B deployment due to state management. Fixed.
- Single set of spec files were maintained for Dual site causing file overwrite for Site A. Fixed.
- VCF Installer for Site B needed to be on Site A Untagged-HoL network. Fixed.
- New ESX hosts would get created on retry even if the task had successfully completed in the previous try. Fixed.
- Fixed DNSMASQ configuration to not respond to AAAA queries that caused nslookup commands to time out
- Fixed the bug to point the VCF Installer in site b to use Untagged-HOL network with IP x.x.10.251
- Fixed iptables to not loose SSH and Webtop access on HoloRouter reboot
- Fixed the code to not throw an error when the network manager output file already exists
- Removed old journal logs from HoloRouter
- Fixed the issue in configuring DNSMASQ as primary DNS server in HoloRouter (during Set-HoloRouter) when HoloRouter uses DHCP
- Fixed Proxy FQDN to point to the right IP i.e. x.x.10.129 instead of x.x.1.129
- Fixed the inter-VRF communication by adding l3mdev settings on HoloRouter
- Fixed the rp_filter settings on HoloRouter
- Fixed the NTP and router IP/FQDN mappings used in VCF installer to fix the expected vs found IP warnings while deployment
- Fixed Network Manager not to fail if there are multiple files /etc/systemd/network/ folder
- Fixed Network Manager not to throw an error when the network manager output file already exists

---

## Holodeck 9.0 – Initial Release

**Release Date:** June 2025  
**Supported VCF Versions:** VCF 9.0, VCF 5.2.x  
**Minimum ESX Version:** 8.0 U3

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

## Environment Breakdown

Each Holodeck environment includes a pre-configured set of virtual infrastructure components.

=== "VCF 9.0"

    - A **Holorouter appliance** (Photon OS based) with:
    - DNS, DHCP, NTP, Proxy
    - Dynamic routing (BGP), L2 switching
    - Optional webtop (browser-based desktop)
    - Support for **VCF** and **VVF** deployments
    - Supports **vSAN ESA** and **vSAN OSA**
    - Online and offline **depot support** for the VCF Installer
    - **Management Domain** includes:
    - 4 nested ESX hosts as vSAN ready nodes
    - VCF Installer, vCenter, NSX, VCF Operations, SDDC Manager
    - Optional: VCF Automation
    - **Optional Workload Domain**:
    - 3 nested ESX hosts
    - vCenter, NSX, optional Supervisor Cluster
    - **Optional NSX Edge Clusters** in management and/or workload domains
    - Deploy additional 3-node vSphere clusters within management domain
    - **Provision-only mode** to deploy just the installer and hosts
    - Custom **CIDR support** for flexible networking

=== "VCF 5.2"

    - A **Holorouter appliance** (Photon OS based) with:
    - DNS, DHCP, NTP, Proxy
    - Dynamic routing (BGP), L2 switching
    - Optional webtop (browser-based desktop)
    - Supports **VCF deployment only**
    - **vSAN OSA** support
    - **Management Domain** includes:
    - 4 nested ESX hosts as vSAN ready nodes
    - Cloud Builder, vCenter, NSX, SDDC Manager
    - **Optional Workload Domain**:
    - 3 nested ESX hosts
    - vCenter and NSX
    - **Optional NSX Edge Clusters** in management and/or workload domains
    - Deploy additional 3-node vSphere clusters within management domain
    - Custom **CIDR support** for flexible networking

---

## Known Issues

### Common

- Hosts with memory tiering enabled may cause instability in nested workloads
- vSAN ESA may consume more storage than expected due to nested deduplication/compression behavior

### Holodeck 9.0.1

No issues reported so far.

### Holodeck 9.0

??? question "Online Depot Check Failure: `ConvertFrom-Json: Cannot bind argument to parameter 'InputObject' because it is null.`"

    If you’re using the **online depot** route for VCF Installer configuration, there is a known issue where the final validation step fails due to a mismatch between the API response format expected by Holodeck and the actual output from VCF Installer.

    ```log
    27-06-2025 00:43:32 SddcMgmtDomain[63248]: [INFO] Setting up depot for VCF Installer
    27-06-2025 00:43:32 SddcMgmtDomain[63248]: [INFO] Depot Type selected: online
    27-06-2025 00:43:34 SddcMgmtDomain[63248]: [ERROR] Depot connection failed.
    ConvertFrom-Json: Cannot bind argument to parameter 'InputObject' because it is null.
    Exception: Exiting
    ```

    ### Workaround

    - Login to the **VCF Installer UI** via Webtop  
      (typically at `https://10.1.10.250` unless a custom CIDR was used)
    - Check if the depot is already configured successfully
    - If confirmed, navigate back to PowerShell and run:

    ```powershell
    vi $config.state
    ```

    - Find and manually update the section:

    ```json
    {
      "VCF-Installer-Depot-Setup": {
        "Status": "InProgress"
      }
    }
    ```

    - Change `"Status": "InProgress"` to `"Status": "Success"` to unblock the process.
    - Run `New-HoloDeckInstance` command again to pick up from where it failed.

    Track this issue and future fix here: [GitHub Issue #1](https://github.com/vmware/Holodeck/issues/1#issuecomment-3022048968)

??? question "Why did VM deployment fail with 'VM with name not found using the specified filter(s)'?"

    ![image](images/nested-vm-build-error.png)
    This issue can occur if the **portgroup used by vCenter for VM placement is an uplink portgroup**.  
    Uplink portgroups are static and do not have available ports for VM deployment, which causes Holodeck to fail during the VM provisioning step.

    **Symptoms**:
    - Error: `VM with name 'green-esx-01a' was not found using the specified filter(s)`
    - Deployment halts with: `[ERROR] Deployment failed`

    **When does this happen?**
    - Environments with **multiple vSphere Distributed Switches (vDS)** configured in the same vCenter.
    - The VM placement logic accidentally targets an uplink portgroup.

    **Workaround**:
    - Create a **test portgroup** in the same vDS with **default settings** (non-uplink, ephemeral or static binding).
    - Retry the Holodeck deployment process.

    Track this issue and future fix here: [GitHub Issue #10](https://github.com/vmware/Holodeck/issues/10)

??? question "Users lose Webtop, SSH and ping access to Holorouter on rebooting Holorouter"

    **Reason**: Some of the iptables rules on HoloRouter aren't persistent across reboots 

    **Impacted Services**: SSH, Ping, and Webtop; None of the other Holodeck infrastructure services should have any impact due to this bug.
    
    **Workaround**: 
    
    1. If you haven't rebooted the HoloRouter yet but are planning to, run the following command before rebooting it - 
    ```
    iptables-save > /etc/systemd/scripts/ip4save
    ```

    2. If you've already rebooted the HoloRouter, since you don't have SSH access, log into the HoloRouter console in the vCenter/ESX host and run the following commands - 

    ```
    iptables -D INPUT -i eth0 -j DROP
    iptables -A INPUT -i lo -j ACCEPT
    iptables -A INPUT -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT
    iptables -A INPUT -p tcp -m tcp --dport 22 -j ACCEPT
    iptables -A INPUT -i eth0 -p icmp -j ACCEPT
    iptables -A INPUT -i eth0 -p tcp -m tcp --dport 22 -j ACCEPT
    iptables -A INPUT -i eth0 -p tcp -m tcp --dport 30000 -j ACCEPT
    iptables -A INPUT -i eth0 -j DROP
    ```
     Track this issue and future fix here: [GitHub Issue #12](https://github.com/vmware/Holodeck/issues/12)
---

## Previous Versions

Looking for Holodeck 5.2 setup guidance? Refer to the [Holodeck 5.2 documentation](https://www.vmware.com/docs/vmw-vcf-holodeck-v52-setup).

---

## Reporting Issues

To raise issues, feature requests, or provide feedback, please visit the [Holodeck GitHub repository](https://github.com/vmware/Holodeck/issues).
