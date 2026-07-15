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

## Reporting Issues

To raise issues, feature requests, or provide feedback, please visit the [Holodeck GitHub repository](https://github.com/vmware/Holodeck/issues).
