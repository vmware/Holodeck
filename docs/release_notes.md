# Release Notes

This page documents the key features, enhancements, and capabilities available in Holodeck 9.0.

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

??? question "Online Depot Check Failure: `ConvertFrom-Json: Cannot bind argument to parameter 'InputObject' because it is null.`"

    If you're using the **online depot** route for VCF Installer configuration, there is a known issue where the final validation step fails due to a mismatch between the API response format expected by Holodeck and the actual output from VCF Installer.

    **Workaround**

    - Login to the **VCF Installer UI** via Webtop and check if the depot is already configured successfully.
    - If confirmed, navigate back to PowerShell, edit `$config.state`, change `"Status": "InProgress"` to `"Status": "Success"` for the VCF-Installer-Depot-Setup step, and re-run `New-HoloDeckInstance`.

    **Fixed in:** Holodeck 9.0.1

    Track this issue here: [GitHub Issue #1](https://github.com/vmware/Holodeck/issues/1#issuecomment-3022048968)

??? question "Users lose Webtop, SSH and ping access to Holorouter on rebooting Holorouter"

    **Reason**: Some of the iptables rules on HoloRouter aren't persistent across reboots.

    **Workaround**: Before rebooting, run `iptables-save > /etc/systemd/scripts/ip4save`.

    **Fixed in:** Holodeck 9.0.1

    Track this issue here: [GitHub Issue #12](https://github.com/vmware/Holodeck/issues/12)

??? question "DNS requests timeout due to AAAA query forwarding to upstream DNS server"

    DNS resolution returns the correct IP address but times out with `SERVFAIL` messages due to AAAA (IPv6) query forwarding.

    **Fixed in:** Holodeck 9.0.1

    Track this issue here: [GitHub Issue #16](https://github.com/vmware/Holodeck/issues/16)

??? question "HoloRouter configuration fails when using DHCP"

    When HoloRouter is configured with DHCP, `Set-HoloRouter` fails at **"Adding DNSMASQ server as the default DNS Server"**.

    **Workaround**: Configure HoloRouter with a **static IP address** instead of DHCP.

    **Fixed in:** Holodeck 9.0.1

    Track this issue here: [GitHub Issue #7](https://github.com/vmware/Holodeck/issues/7)

---

## Reporting Issues

To raise issues, feature requests, or provide feedback, please visit the [Holodeck GitHub repository](https://github.com/vmware/Holodeck/issues).
