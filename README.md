# Holodeck 9 Documentation

[![CI](https://github.com/vmware/Holodeck/actions/workflows/ci.yml/badge.svg)](https://github.com/vmware/Holodeck/actions/workflows/ci.yml)
[![Links](https://github.com/vmware/Holodeck/actions/workflows/links.yml/badge.svg)](https://github.com/vmware/Holodeck/actions/workflows/links.yml)
[![GitHub Pages](https://img.shields.io/badge/docs-live-blue)](https://vmware.github.io/Holodeck/)

This repository contains the source for the [Holodeck documentation site](https://vmware.github.io/Holodeck/), built with [MkDocs Material](https://squidfunk.github.io/mkdocs-material/).

Holodeck is a toolkit for deploying nested VMware Cloud Foundation (VCF) environments on a single ESX host or vSphere cluster. It automates the provisioning of fully self-contained VCF labs for testing, training, and capability exploration.

## Documentation Overview

The site covers the following topics:

- **Getting Started** -- Prerequisites, deployment steps, and post-deployment access
- **Release Notes** -- Features, enhancements, bug fixes, and known issues per release
- **Downloads** -- Links to HoloRouter OVA, VCF binaries, and the Offline Depot appliance
- **Command Reference** -- PowerShell cmdlets for managing Holodeck instances
- **Offline Depot** -- Deploying and configuring the Offline Depot Appliance for air-gapped environments
- **Support** -- How to report issues, request features, and join the community
- **FAQ** -- Troubleshooting and frequently asked questions

## Local Development

To build and preview the documentation locally:

### Prerequisites

- Python 3.12 or later
- Git

### Setup

```bash
git clone https://github.com/vmware/Holodeck.git
cd Holodeck
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Preview

```bash
mkdocs serve
```

The site will be available at `http://127.0.0.1:8000`. Changes to Markdown files are reflected automatically.

## Contributing

1. Fork the repository and create a feature branch.
2. Make your changes in the `docs/` directory.
3. Preview locally with `mkdocs serve` to verify formatting.
4. Submit a pull request against the `main` branch.

For bug reports and feature requests related to Holodeck itself, please use [GitHub Issues](https://github.com/vmware/Holodeck/issues).

## Contributors

<table>
  <tr>
    <td align="center"><a href="https://www.linkedin.com/in/bensier/"><img src="https://avatars.githubusercontent.com/u/214005002?v=4" width="80px;" style="border-radius:50%;" alt="Ben Sier"/><br /><sub><b>Ben Sier</b></sub></a></td>
    <td align="center"><a href="https://www.linkedin.com/in/dhruv-tyagi-2015"><img src="https://avatars.githubusercontent.com/u/214002005?v=4" width="80px;" style="border-radius:50%;" alt="Dhruv Tyagi"/><br /><sub><b>Dhruv Tyagi</b></sub></a></td>
    <td align="center"><a href="https://www.linkedin.com/in/jatinpurohit92/"><img src="https://avatars.githubusercontent.com/u/163879384?v=4" width="80px;" style="border-radius:50%;" alt="Jatin Purohit"/><br /><sub><b>Jatin Purohit</b></sub></a></td>
    <td align="center"><a href="https://www.linkedin.com/in/kulkarninikhilm/"><img src="https://avatars.githubusercontent.com/u/214144950?v=4" width="80px;" style="border-radius:50%;" alt="Nikhil Kulkarni"/><br /><sub><b>Nikhil Kulkarni</b></sub></a></td>
  </tr>
</table>

## Disclaimer

Holodeck is not an officially supported product. It is intended for testing and training environments only.
