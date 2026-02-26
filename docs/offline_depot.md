# Offline Depot

### Overview

The Offline Depot Appliance (ODA) facilitates the creation and maintenance of a VMware Cloud Foundation (VCF) offline depot. An offline depot stores software for VCF installation or updates.

While VCF has built-in capabilities to use an online depot managed by Broadcom, an offline depot offers several key advantages:

- **Restricted Environments**: Enables VCF deployments in environments with limited or no external network connectivity. 
- **Faster Speeds**: Provides quicker download and installation speeds due to local proximity. 
- **Content Curation**: Allows organizations to control and curate the VCF binaries available to their instances. 

Additionally, the ODA provides features beyond basic offline depot functionality:

- **Holodeck Support**: Integrates with Holodeck for automated deployment of virtualized VCF instances, reducing physical hardware requirements and costs.
- **Simplified Management**: Optionally includes a Jupyter Lab instance with notebooks for streamlined depot maintenance and Holodeck integration tasks.

### Obtaining a Download Token

In order to leverage the ODA to download and populate the depot with the required binaries, you will need a download token. 

You can obtain a download token by following the instructions described in this [Broadcom KnowledgeBase Article](https://knowledge.broadcom.com/external/article/390098).
### Deployment Options if Using Holodeck

When using Holodeck, there are two primary options for deploying the ODA:

- **Management Network Deployment (Recommended)**

  Deploying the ODA on the management network is the recommended method. This configuration provides the ODA with direct network access to download binaries and enables full functionality, including the AI chatbot. Additionally, the integrated Jupyter notebooks can be leveraged to streamline tasks such as copying binaries to the Holorouter and accessing HoloDeck configuration information.

- **Isolated Network Deployment**

  While deploying the ODA on an isolated network is possible, it requires additional steps. Initially, the isolated network lacks external connectivity until the Holorouter is fully configured with BGP and DNS. This means binaries cannot be directly downloaded to the ODA. As a workaround, you must manually download and copy the SDDC Manager and ESX binaries to the Holorouter before initiating the Holorouter deployment. Once the Holorouter is online and configured, it can forward internet requests, enabling direct binary downloads to the ODA.

### Deploying the Offline Depot Appliance

<ol>
    <li>
        To deploy the appliance, simply deploy the OVA on your vCenter Server like you would normally do.
        <figure markdown="span">
            <img src="../images/Deploy-Offline-Depot-Step-1.png">
        </figure>
        <br>
    </li>
    <li>
        Next, provide a name for the VM and specify its deployment location:
        <figure markdown="span">
            <img src="../images/Deploy-Offline-Depot-Step-2.png">
        </figure>
        <br>
    </li>
    <li>
        Then, select the compute resource for the VM. You can choose to automatically start the VM after import by checking the box; otherwise, you can power it on manually to observe the first boot process.
        <figure markdown="span">
            <img src="../images/Deploy-Offline-Depot-Step-3.png">
        </figure>
        <br>
    </li>
    <li>
        Review the settings and proceed by clicking Next.
        <figure markdown="span">
            <img src="../images/Deploy-Offline-Depot-Step-4.png">
        </figure>
        <br>
    </li>
    <li>
        Next, select appropriate storage with sufficient capacity for your needs.
        <figure markdown="span">
            <img src="../images/Deploy-Offline-Depot-Step-5.png">
        </figure>
        <br>
    </li>
    <li>
        On the next screen, select the network for ODA deployment. As discussed in the previous section, it is recommended to deploy the appliance on the management network.
        <figure markdown="span">
            <img src="../images/Deploy-Offline-Depot-Step-6.png">
        </figure>
        <br>
    </li>
    <li>
        Now, specify the networking attributes, including hostname, IP address, and netmask, according to your environment's requirements.
        <figure markdown="span">
            <img src="../images/Deploy-Offline-Depot-Step-7a.png">
        </figure>
        <br>
    </li>
</ol>

The subsequent section allows you to set the password for the admin user, which is used for SSH access to the appliance.

Following this, configure the depot-specific options:

- **Skip Binary Download:**
  Selecting this option prevents the appliance from automatically downloading required VCF binaries during power-on, which is useful if a download token is not available at installation. The depot can be populated manually or using the included Jupyter Notebooks after deployment.

- **Download Token:**
  Provide a download token to enable automatic download of VCF binaries upon appliance power-on. If no token is provided, the download attempt will time out. Similar to skipping the download, manual population or Jupyter Notebooks can be used later.

- **VCF Version:**
  Specify the target VCF version for binary downloads (e.g., '9.0' for VCF 9). The Advanced section offers options to enable SSH and the Jupyter Lab server. Enabling the Jupyter Lab server is highly recommended and is selected by default.

<figure markdown="span">
    <img src="../images/Deploy-Offline-Depot-Step-7b.png">
</figure>

### Initial Boot

After you deploy the appliance, you'll want to power it on. Note that the first time you power it on, it will perform some configuration steps and then reboot itself. These configuration steps will only occur the first time you boot the VM.

Please wait until the second boot completes until trying to use the appliance.
### Accessing the Appliance Web Server

With the appliance online, use a web browser and go to:

`http://<ODA_IP>`

You should see this if you selected the option to skip the automatic download of the binaries or if the appliance had some issue trying to download the binaries:

<figure markdown="span">
    <img src="../images/Offline-Depot-Web-Server.png">
</figure>

This indicates that no binaries have been put into place on the depot. After you download binaries (see below) then this will be populated.

### Accessing the Jupyter Lab Server

You can also access the Jupyter Lab server (if you enabled it) by using the following URL: 

http://<ODA_IP>:8888

<figure markdown="span">
    <img src="../images/Offline-Depot-Jupyter-Notebook.png">
</figure>

Here, you will see two Jupyter notebooks that can assist you in performing a variety of tasks. 

### Accessing the VCF Product Documentation

To make things a bit easier for people, copies of the VCF 5.2 and 9.0 product documentation is included on the appliance under /var/www/docs

### Logging into the ODA

You can login to the ODA appliance as the user **admin** with the password you set at boot.

If you need to become root, simply use sudo

```
sudo su
```
### Populating the Binaries

There are three methods to populate the depot with VCF binaries. Choose the method that best fits your environment.

#### Option One: Automatic Download (Requires Internet and Download Token)

If the ODA has internet connectivity and you provided a download token during deployment, binaries are downloaded automatically on first boot. This is the simplest method and requires no manual intervention.

#### Option Two: Leverage the Jupyter Notebook

This is the preferred manual method, as it makes things a bit easier. Simply access the Depot Maintenance Jupyter Notebook and go to the section about downloading the binaries and follow the directions.

<figure markdown="span">
    <img src="../images/Offline-Depot-Jupyter-Notebook-Manual-1.png">
</figure>

Please note that the Jupyter Notebook will display the output of the command cell executed (if there is any). For example, if you ran the cell to download the ESX binaries for Holodeck, you would see something similar to this:

<figure markdown="span">
    <img src="../images/Offline-Depot-Jupyter-Notebook-Manual-2.png">
</figure>

It's important to note that you can make these Jupyter Notebooks specific to your environment by modifying the commands or adding more.

#### Option Three: Manually Use the VCF Download Tool

The VCF Download Tool (VDT) is also included with this version of the ODA under the /root/vdt/bin directory.

The VDT tool replaces the Offline Bundle Transfer Utility (OBTU) tool previously used. It also has some extensive help that you can access by using the -help argument.

#### Option Four: Manually Populate the Depot (Darksite / Air-Gapped)

In environments with no internet connectivity (darksite or air-gapped), you must manually transfer the binaries and metadata files to the ODA. This involves two categories of files:

1. **Binary files** -- the VCF component OVAs, ISOs, and tarballs
2. **Metadata files** -- JSON manifest and catalog files that VCF Installer uses to discover available software

!!! warning "Metadata Files Are Required"
    Simply copying binaries to the ODA is not sufficient. The metadata files (manifest, product version catalog, and vSAN HCL data) must also be present for VCF Installer to recognize and use the depot. Without these files, the depot will not function correctly.

**How to Obtain the Binaries and Metadata Files**

**Broadcom Support Portal**: Download the individual component binaries (OVAs, ISOs, tarballs) from the specific VCF version downloads page on the Broadcom Support Portal. For the metadata files, download the `<vcf-version>-offline-depot-metadata.zip` file from the **VCF Installer** section. This ZIP contains the required manifest, product version catalog, and related metadata files. Place the binaries into the appropriate directory structure shown below on the ODA.

#### Directory Structure and Permissions

The depot files must be placed under `/var/www/build` on the ODA with the correct directory structure. Below is the expected layout for a VCF 9.0 depot:

```
/var/www/build
└── PROD
    ├── COMP
    │   ├── ESX_HOST
    │   │   └── VMware-VMvisor-Installer-<version>.x86_64.iso
    │   ├── NSX_T_MANAGER
    │   │   └── nsx-unified-appliance-<version>.ova
    │   ├── SDDC_MANAGER_VCF
    │   │   ├── Compatibility
    │   │   │   └── VmwareCompatibilityData.json
    │   │   └── VCF-SDDC-Manager-Appliance-<version>.ova
    │   ├── VCENTER
    │   │   └── VMware-VCSA-all-<version>.iso
    │   ├── VCF_OPS_CLOUD_PROXY
    │   │   └── Operations-Cloud-Proxy-<version>.ova
    │   ├── VRA
    │   │   └── vmsp-vcfa-combined-<version>.tar
    │   ├── VROPS
    │   │   └── Operations-Appliance-<version>.ova
    │   └── VRSLCM
    │       └── VCF-OPS-Lifecycle-Manager-Appliance-<version>.ova
    ├── metadata
    │   ├── manifest
    │   │   └── v1
    │   │       └── vcfManifest.json
    │   └── productVersionCatalog
    │       └── v1
    │           ├── productVersionCatalog.json
    │           └── productVersionCatalog.sig
    └── vsan
        └── hcl
            ├── all.json
            └── lastupdatedtime.json
```

The key directories are:

| Directory | Contents |
|-----------|----------|
| `PROD/COMP/` | Component binaries organized by product (ESX, NSX, SDDC Manager, vCenter, etc.) |
| `PROD/COMP/SDDC_MANAGER_VCF/Compatibility/` | VMware compatibility data JSON |
| `PROD/metadata/manifest/v1/` | VCF manifest file used by SDDC Manager to discover available software |
| `PROD/metadata/productVersionCatalog/v1/` | Product version catalog and its signature file |
| `PROD/vsan/hcl/` | vSAN Hardware Compatibility List data |

If you populate the binaries manually, you need to ensure the files are in the proper location with the proper permissions. You can leverage the Jupyter Notebooks or manually execute the commands:

<figure markdown="span">
    <img src="../images/Offline-Depot-Jupyter-Notebook-Manual-3.png">
</figure>

Set proper ownership and permissions on all depot files:

```bash
chown -R nginx /var/www
chgrp -R nginx /var/www
chmod -R 750 /var/www
chmod g+s /var/www
```

Failure to set the permissions properly will result in the inability to download the files from the depot.

Once the depot is ready, you should be able to access the web server by accessing the web server on http://ODA-IP

<figure markdown="span">
    <img src="../images/Offline-Depot-Web-Server-2.png">
</figure>

### Configuring HTTPS (SSL/TLS) for the Offline Depot

By default, the ODA serves the depot over HTTP. However, HTTPS can be used when communicating with the VCF Installer. While Holodeck automates the `application-prod.properties` modification on the VCF Installer to allow HTTP, you may prefer to configure the depot with proper HTTPS support -- especially in production-like lab environments.

This section walks through creating a certificate chain and configuring NGINX for HTTPS on the ODA.

#### Step 1: Create the Directory Structure

```bash
mkdir -p /etc/nginx/ssl/ca/{root,intermediate,server}
cd /etc/nginx/ssl
```

#### Step 2: Create the Root CA

```bash
openssl genrsa -out ca/root/rootCA.key 4096

openssl req -x509 -new -nodes -key ca/root/rootCA.key -sha256 -days 3650 \
  -out ca/root/rootCA.pem \
  -subj "/C=US/ST=CA/L=Lab/O=MyLab/CN=MyLab Root CA"
```

#### Step 3: Create the Intermediate CA

```bash
openssl genrsa -out ca/intermediate/intermediate.key 4096

openssl req -new -key ca/intermediate/intermediate.key \
  -out ca/intermediate/intermediate.csr \
  -subj "/C=US/ST=CA/L=Lab/O=MyLab/CN=MyLab Intermediate CA"

openssl x509 -req -in ca/intermediate/intermediate.csr \
  -CA ca/root/rootCA.pem -CAkey ca/root/rootCA.key -CAcreateserial \
  -out ca/intermediate/intermediate.pem -days 1825 -sha256 \
  -extfile <(echo "basicConstraints=CA:TRUE,pathlen:0")
```

#### Step 4: Create the Server Certificate

Generate a private key and CSR for the ODA. Replace the CN and SAN values with your ODA's FQDN and IP:

```bash
openssl genrsa -out ca/server/server.key 2048

openssl req -new -key ca/server/server.key \
  -out ca/server/server.csr \
  -subj "/C=US/ST=CA/L=Lab/O=MyLab/CN=<ODA_FQDN>"
```

Create a SAN extension file at `ca/server/server_ext.cnf`:

```
subjectAltName = DNS:<ODA_FQDN>,IP:<ODA_IP>
extendedKeyUsage = serverAuth
keyUsage = digitalSignature, keyEncipherment
```

Sign the CSR with the Intermediate CA:

```bash
openssl x509 -req -in ca/server/server.csr \
  -CA ca/intermediate/intermediate.pem -CAkey ca/intermediate/intermediate.key \
  -CAcreateserial -out ca/server/server.crt -days 825 -sha256 \
  -extfile ca/server/server_ext.cnf
```

#### Step 5: Build the Full Certificate Chain

The chain must be ordered: Server cert -> Intermediate cert -> Root cert:

```bash
cat ca/server/server.crt ca/intermediate/intermediate.pem ca/root/rootCA.pem \
  > ca/server/server-chain.pem
```

#### Step 6: Set File Permissions

```bash
chown root:root ca/root/rootCA.pem ca/intermediate/intermediate.pem \
  ca/server/server.crt ca/server/server-chain.pem
chmod 644 ca/root/rootCA.pem ca/intermediate/intermediate.pem \
  ca/server/server.crt ca/server/server-chain.pem

chown root:root ca/root/rootCA.key ca/intermediate/intermediate.key \
  ca/server/server.key
chmod 600 ca/root/rootCA.key ca/intermediate/intermediate.key ca/server/server.key

chown root:root /etc/nginx/ssl
chmod 700 /etc/nginx/ssl
```

#### Step 7: Configure NGINX for HTTPS

Edit the NGINX configuration at `/etc/nginx/nginx.conf` and update the `server` block:

```nginx
server {
    listen       80;
    listen       443 ssl;
    server_name  <ODA_FQDN>;

    ssl_certificate      /etc/nginx/ssl/ca/server/server-chain.pem;
    ssl_certificate_key  /etc/nginx/ssl/ca/server/server.key;
    ssl_protocols        TLSv1.2 TLSv1.3;
    ssl_session_cache    shared:SSL:1m;
    ssl_session_timeout  5m;
    ssl_ciphers          HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    location / {
        root      /var/www/build;
        index     index.html index.htm;
        autoindex on;
    }
}
```

Test and reload NGINX:

```bash
nginx -t
systemctl reload nginx
```

#### Step 8: Open Firewall Port for HTTPS

```bash
iptables -A INPUT -i eth0 -p tcp -m tcp --dport 443 -j ACCEPT
iptables-save > /etc/systemd/scripts/ip4save
```

### Caveats

Consider the following important points when using the offline depot:

- **Disk Space**: The appliance is provisioned with approximately 300GB of disk space. Depending on your use case and the number of binaries, additional storage may be required. Refer to the "How to Expand the Storage" section for instructions on increasing disk capacity.

- **Jupyter Lab on ESX**: A known issue exists where the Jupyter Lab server may not configure correctly when the depot appliance is deployed directly to an ESX host. The depot functionality remains unaffected. 
  - **Recommendation**: To avoid this issue, deploy the appliance to a vCenter instance.

### How to Expand the Storage

You might need to expand the filesystem of the depot as you populate it with more binaries. 

These procedures are documented in the included Jupyter Notebook. This allows you to execute them directly from there. However, if you chose not to install the Jupyter Notebooks, the instructions are duplicated here.

First, you need to increase the size of the physical disk. To do this, simply edit the size of the disk for the VM and increase it to what will suit your needs. It will support up to 5.9TB in size.

Next, we need to make sure the OS is aware of the space increase:
```
echo 1 > /sys/block/sda/device/rescan
```
Finally, we will execute this command in order to resize the partition
```
printf 'yes\n100%%\n' | parted /dev/sda resizepart 2 ---pretend-input-tty
```
You can verify that the partition has been resized by using the following command:
```
parted -s -a opt /dev/sda "print free"
```

<figure markdown="span">
    <img src="../images/Offline-Depot-Storage-Expansion.png">
</figure>

Next, you need to expand the filesystem in order to take advantage of the new partition space by using a command like:
```
resize2fs /dev/sda2
```
