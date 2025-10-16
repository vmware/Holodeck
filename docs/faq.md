<h1 style="text-align: center"><strong>❓ Frequently Asked Questions (FAQ)</strong></h1>


Welcome! Here are answers to some of the most common questions about **Holodeck** and deploying **VCF 9.0**.

---

## Getting Started

??? question "What is Holodeck?"
    **Holodeck** is a validated reference architecture and toolkit that simplifies the setup of VMware Cloud Foundation (VCF) lab environments.  
    It includes pre-built components like HoloRouter, pre-configured networking, and deployment scripts to accelerate VCF evaluation and training.

??? question "What version of VCF is supported?"
    Holodeck 9.0.1 currently supports **VCF 9.0.0.0, VCF 9.0.1.0, VCF 5.2, VCF 5.2.1** and **VC 5.2.2**.

??? question "Is internet access required for deployment?"
    Holodeck can be used in both **connected** and **air-gapped** environments.  
    For offline deployments, you must download the **Offline Depot OVA** in advance.

---

## Installation & Setup

??? question "What are the system requirements for running Holodeck?"    
    Refer to the [Pre-requisites section](index.md#pre-requisites) for details.

??? question "Do I need a license to use VCF 9.0?"
    VCF 9.0 provides a 90-day trial post which customers are required to apply license.

---

## Troubleshooting


### General Issues

??? question "Where can I report a bug or issue?"
    You can open an issue on GitHub:  
    <a href="https://github.com/vmware/Holodeck/issues" target="_blank" rel="noopener"><strong>🔗 vmware/Holodeck – GitHub Issues</strong></a>

??? question "I can't access the Broadcom Support Portal downloads."
    - Ensure you're signed in with a Broadcom account.
    - Your account must have **entitlement** for VCF 9.0.
    - Contact Broadcom support if access problems persist.

### Pre-check Issues

??? question "I'm getting `<Component> binary was not found. Download the binary from the Broadcom support portal and place it in /holodeck-runtime/bin/<version> folder`. What should I do?"

    This error occurs when the ESX and VCF Installer/Cloud Builder ISO/OVA are not placed in the required folder /holodeck-runtime/bin/<9.0 or 5.2>/

    Ensure that the binaries are present in the folder.

??? question "I'm getting `[ERROR] No trunk port groups found on the connected server`. What should I do?"

    This error appears when running the Holodeck **pre-checks script**, and indicates that no **trunk port group** was found on the target host:

    ```
    PreChecks[xxxxx]: [ERROR] No trunk port groups found on the connected server. Please create a trunk port group on the Target Host and run the pre-checks script again. Exiting
    ```

    **What it means:**
    - The pre-check process is validating the ESX host's networking setup.
    - A required **trunk port group** (i.e., one that accepts VLAN ID `4095` or multiple VLANs) does not exist on the host.

    **How to fix:**

    If using stand-alone ESX as the target:

    1. Log in to the **vSphere Host Client** for the ESX host 
    2. Go to **Networking → Port Groups**
    3. Create a new port group (or edit an existing one) with the following:
       - **VLAN ID**: `4095` *(this enables VLAN trunking)*
       - **Virtual Switch**: Usually `vSwitch0` or the one attached to your uplink
       - **Promiscuous Mode**: Accept
       - **MAC Address Changes**: Accept
       - **Forged Transmits**: Accept
    4. Save the settings and rerun the pre-checks script

    If using vCenter as the target, then perform the same steps but for the vDS.

    **Why this matters:**  
    Holodeck relies on a trunk port group to simulate physical networks and allow nested components (like NSX and VCF VMs) to communicate across VLANs.

    🛠️ Example port group config:
    - Name: `Trunk-PG`
    - VLAN ID: `4095`
    - Switch: `vSwitch0`

    If you're unsure how to create this, refer to VMware's documentation or the Holodeck deployment guide.

??? question "I'm getting `[ERROR] NTP service is not running on target host`. How do I fix this?"

    During the pre-checks phase, you may encounter this error:

    ```
    PreChecks[xxxxx]: [ERROR] NTP service is not running on target host 10.162.11.248. Enable NTP service before proceeding
    ```

    **What it means:**
    - The **Network Time Protocol (NTP)** service on the ESX host is not active.
    - Accurate and synchronized time is required across all hosts in a VCF deployment to avoid certificate, authentication, and cluster issues.

    **How to fix:**
    1. **Log in** to the ESX host UI (e.g., `https://10.162.11.248`)
    2. Navigate to:  
       **Manage → System → Time & Date**
    3. Click **Edit Settings**
       - Set time synchronization to **NTP**
       - Add a known NTP server (e.g. `pool.ntp.org` or your internal time server)
    4. Save the settings
    5. Start the NTP service:
       - Under the **Time & Date** tab, click **Start** next to the NTP service

    **CLI Option (Advanced):**

    SSH into the host and run:

    ```bash
    esxcli network firewall ruleset set -e true -r ntp
    esxcli system ntp set -s pool.ntp.org
    esxcli system ntp set -e true
    esxcli system ntp start
    ```

    After enabling NTP, rerun the pre-checks script.

    > **Important:** All hosts should use the same time source to avoid clock drift across the VCF environment.

### ESX Build Issues


??? question "I see `SSH service on <IP> is not responding` and `WARNING: Host key is not being verified since Force switch is used` during the ESX build process. What does it mean?"

    This log output typically appears during the **host validation step**:

    ```
    WARNING: Host key is not being verified since Force switch is used.
    CustomIso[xxxxx]: [INFO] SSH service on 10.3.1.101 is not responding, Trying after 10 seconds
    ```

    **What it means:**
    - The deployment script is attempting to connect to the ESX host via SSH.
    - It’s retrying because the host is still booting or SSH is not yet available.
    - This is expected behavior and can take around 10 minutes for the ESX to be ready.

    **What to do:**
    - **Wait for 10-15 minutes** — SSH usually becomes available shortly after ESX finishes booting.
    - If the message persists **for more than 15 minutes**, confirm that:
      - The ESX VM is powered on and reachable
      - Networking is properly configured in your Holodeck setup

    **Still stuck?**  
    Try manually SSHing into the host to confirm access:
    
    ```bash
    ssh root@10.3.1.101
    ```

    If it fails, the host may not have finished booting or networking might be misconfigured.
---

### Miscellaneous

??? question "I don't have enough memory on my physical server. Can I enable memory tiering and still deploy Holodeck?"

    while memory tiering is great for optimized performance and resource consumption in case of application workloads, it is not recommended when running nested environments, 
    it is **not recommended** when running nested environments like Holodeck. These environments are sensitive to latency and memory access speeds, and memory tiering can introduce 
    significant performance degradation.

    Although the deployment might technically complete, you may experience:
    - Crashes or instability in nested ESX hosts
    - Prolonged deployment times
    - Overall sluggish performance

    👉 **Recommendation:** Only deploy Holodeck on systems with sufficient physical RAM and without memory tiering enabled to ensure a stable and responsive experience.

---

??? question "I deployed VCF in vSAN ESA mode with large disks, but the datastore appears fully consumed. Why?"

    When using **vSAN ESA (Express Storage Architecture)** in a nested setup, it's common to see high disk usage even when the documented minimum requirements are met.

    🔍 **Why this happens:**
    - ESA is designed for high-throughput, direct-attached NVMe or vSAN-backed storage.
    - In a **nested environment**, performance and storage efficiency are reduced—especially if the underlying physical storage is **not vSAN**.

    🚫 If you're running nested vSAN ESA on non-vSAN storage (e.g. local disks or NFS), you may encounter:
    - Unexpected datastore consumption
    - Poor performance or storage overhead
    - Inefficient space usage due to thin provisioning at multiple layers

    ✅ **Recommendation:** For optimal results, deploy Holodeck and nested vSAN ESA on physical infrastructure that is also running vSAN.


## Community & Resources

??? question "Where can I get help or connect with others?"
    - Join the Broadcom VCF Community:  
    <a href="https://community.broadcom.com/vmware-cloud-foundation/communities/vcfcommunityhomeblogs?CommunityKey=da5e3e1f-7070-4284-bf40-0191244ccc0c" target="_blank" rel="noopener"><strong>VMware Holodeck Community</strong></a>
    - Open a GitHub discussion or issue
    - Stay tuned for webinars and virtual workshops

---

## Downloads

??? question "Where can I find the download links?"
    Visit the [Downloads Page](downloads.md) for all required OVAs, installers, and optional offline tools.

---

Need more help? Visit the [Support Page](support_community.md) or submit a an issue via GitHub

