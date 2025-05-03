# SCADA/IoT Human Machine Interface (HMI)

> A modern cross-platform, responsive Human-Machine Interface (HMI) designed for real-time monitoring, historical data analysis, and control of a research-grade geothermal power plant in Taiwan. It leverages the Total Flow cycle to extract energy directly from the two-phase geothermal fluid.

## Live Demo

- Frontend deployed on Cloudflare Pages: https://scada.hanl.in/
- Backend deployed on Oracle Cloud Infrastructure

![Real-time Monitor](https://github.com/user-attachments/assets/b178e905-4e73-49ac-8b37-0e820c9cf8fe)

## Table of Contents

- [SCADA/IoT Human Machine Interface (HMI)](#scadaiot-human-machine-interface-hmi)
  - [Live Demo](#live-demo)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Features](#features)
  - [Architecture](#architecture)
    - [Software-defined PLC (`scada-iot-plc`)](#software-defined-plc-scada-iot-plc)
    - [Horizontally Scalable Supervisor (`scada-iot-supervisor`)](#horizontally-scalable-supervisor-scada-iot-supervisor)
    - [Modern Responsive HMI (`scada-iot-hmi`)](#modern-responsive-hmi-scada-iot-hmi)
  - [Technology Stack](#technology-stack)
    - [Hardware](#hardware)
    - [Software](#software)
    - [Communication Protocols](#communication-protocols)
  - [Case Study: Total Flow Geothermal Power System](#case-study-total-flow-geothermal-power-system)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Supported Remote Terminal Units (RTUs)](#supported-remote-terminal-units-rtus)
  - [Development Workflow](#development-workflow)
  - [License](#license)
  - [Contact](#contact)

## Overview

The primary goal of this project is to develop and deploy a flexible, developer-friendly, and modern monitoring and control system tailored for a research-grade geothermal power plant and facilitate research and analysis. Key features include:

- Real-time insights into key operational parameters such as well enthalpy, thermal efficiency, fluid temperature, pipe pressure, mass flow rate, and power generation metrics.
- Efficient data acquisition, processing, logging for >100 sensors at ~1 sec resolution.
- High-performance data visualization system for historical data analysis capable of visualizing large datasets with >1 billion data points.
- Implement remote control capabilities for essential plant components.
- Record and display on-site imaging from IP cameras.
- Integration of diverse hardware components using industrial communication protocols.
- A user-friendly remote supervisory control and monitoring via a modern responsive web-based interface with support for phones, tablets, laptops, desktops to huge TV monitors.

## Features

- **Cost-Effectiveness:**

  - Aims to reduce engineering time and hardware costs compared to traditional proprietary DCS/SCADA solutions.
  - Unified JavaScript language across the stack enables flexible placement of logic on the edge, server or client, and simplifies hiring.
  - Leverages open-source software components, minimizing licensing fees.
  - Utilizes readily available and cost-effective hardware as PLCs (Raspberry Pi, Arduino).

- **Real-time Monitoring & Control:**

  - Web and mobile dashboards for real-time data visualization.
  - Interactive charts for historical data discovery and analysis.

- **Modular & Scalable Architecture:**

  - Supports a diverse range of sensors (Temperature: PT100; Pressure: Absolute/Gauge; Flow: Magnetic, Coriolis, Vortex; Power: V, I, Freq, PF; Speed: Optical, Hall; pH; Environmental, etc.).
  - Interfaces with various actuators and alarms.
  - Horizontally scalable using containerized systems.

- **Data Acquisition & Management:**

  - Time-series database (MongoDB) optimized for high-frequency sensor data logging.
  - Comprehensive logging with filtering capabilities.
  - Data export for offline analysis (e.g., CSV, JSON).
  - Historical trend analysis and reporting tools.
  - No data loss even when working with a unreliable 4G connection.

- **Remote Access & Security:**

  - JWT based authentication and authorization for users and plc.

- **Open Standards & Protocols:**

  - Modbus-RTU (RS-485) for robust industrial device communication.
  - REST/WebSocket APIs for seamless frontend/backend integration and third-party access.

- **Cross-Platform Compatibility:**

  - Web interfaces compatible with modern browsers (Chrome, Firefox, Safari, Edge).
  - Progressive Web Apps (PWA) for Android and iOS devices.
  - Backend runs on standard server environments (Linux, Windows, macOS).

## Architecture

The system employs a distributed architecture leveraging modern IoT principles combined with traditional SCADA protocols:

### Software-defined PLC ([`scada-iot-plc`](https://github.com/hotdogee/scada-iot-plc))

- **Description:** Node.js application designed to run on edge hardware (like Raspberry Pi) functioning as a Programmable Logic Controller.
- **Responsibilities:** Direct communication with field devices via MODBUS, real-time data acquisition, execution of control loops, data preprocessing, and communication with the central Supervisor.

### Horizontally Scalable Supervisor ([`scada-iot-supervisor`](https://github.com/hotdogee/scada-iot-supervisor))

- **Description:** Central backend system built with Node.js and FeathersJS.
- **Responsibilities:** Aggregating data from multiple PLCs, managing the MongoDB database for time-series data and configuration, providing real-time updates via WebSockets, offering a REST API, handling user authentication, and orchestrating system-wide logic.

### Modern Responsive HMI ([`scada-iot-hmi`](https://github.com/hotdogee/scada-iot-hmi))

- **Description:** Frontend application built with VueJS and Quasar Framework, functioning as a Progressive Web App (PWA).
- **Responsibilities:** Providing the user interface for real-time data visualization, displaying system status, offering interactive charts for historical data analysis, allowing remote control actions, and managing user sessions.

![architecture-diagram](https://github.com/user-attachments/assets/dbdecedd-dfca-4188-955a-7ce15d3ccca2)

## Technology Stack

### Hardware

- **Edge Controller:** Raspberry Pi serves as the main processing unit.
- **Remote Terminal Units (RTUs):** Industrial controllers interfacing with field devices.
- **Sensors:** Temperature (RTD PT100), Pressure (Danfoss MBS 3000), Electromagnetic Flowmeters (BMS, LDG), Coriolis Flowmeters (E+H, Micro Motion), Vortex Flowmeters (MIK-LUGB), pH Meters, Optical/Hall Effect RPM Sensors, Electrical (Voltage, Current, Frequency, Power), etc.
- **Actuators:** Valves, Alarms, and Inverters (ABB PVI-12.5-TL-OUTD).
- **Networking:** Ethernet Switches, WiFi Access Points, 4G/LTE Routers, USB-to-RS485/232 Converters.
- **Cameras:** IP Cameras with on-site NAS recording.
- **Power:** Mean Well Power Supplies (24VDC, 12VDC, 5VDC).
- **Analysis Tools:** Hioki Power Analyzers, FLIR Thermal Cameras, High-Speed Cameras.

### Software

- **Backend / PLC:** Node.js, FeathersJS (Supervisor)
- **Frontend:** VueJS, Quasar Framework, Highcharts
- **Database:** MongoDB
- **Message Queue:** RabbitMQ (AMQP)
- **Real-time Communication:** WebSockets (TCP/IP)
- **Industrial Communication:** MODBUS RTU (RS-485)
- **Hardware Platform (Edge):** Raspberry Pi OS / Linux
- **Process Management:** PM2
- **Web Server/Proxy:** Nginx

### Communication Protocols

- **MODBUS-RTU:** Used for robust communication with RTUs and other industrial devices connected to the custom I/O modules or directly.
- **WebSockets:** Enables real-time, bidirectional communication between the Node.js backend, the supervisory control system, and the user interface (UI).

## Case Study: Total Flow Geothermal Power System

This system was instrumental in the development and testing of a Total Flow geothermal power generation unit:

- **Monitored Parameters:** Wellhead pressure/temperature, flow rates (total, steam, brine), turbine inlet/outlet conditions, generator output (Voltage, Current, Frequency, Power Factor, kW, kVA), vibration, cooling system parameters, pH, ambient conditions.
- **Control:** Valve positioning for flow regulation, generator load control (via load banks or grid-tie inverters), emergency shutdown sequences.
- **Data Logging:** Captured high-frequency data during various test phases (load bank testing, grid synchronization trials) for performance analysis (e.g., Power vs. Pressure Drop curves, efficiency calculations).
- **Remote Operation:** Enabled remote monitoring of the unmanned test site via web dashboards and live camera feeds.

## Getting Started

### Prerequisites

- **Node.js:** Version 18+ recommended (check individual subproject `package.json` engines if specified).
- **npm:** Version 8+ recommended (comes with Node.js).
- **Git:** For cloning the repository.
- **MongoDB:** A running instance accessible by the `scada-iot-supervisor` backend.

### Supported Remote Terminal Units (RTUs)

- **NHR5200**: Temperature and pressure sensors
- **DW8/DW9**: Power meters
- **NHR3800**: Frequency meters
- **NHR3500**: Advanced power quality analyzers
- **GPE**: Mass flow meters
- **SINLDG**: Magnetic Flow meters
- **Supmea LMAG**: Magnetic Flow meters

## Development Workflow

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/hotdogee/scada-iot-hmi.git
    cd scada-iot-hmi
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Run the development server:** (with hot-reloading)

    ```bash
    npm run dev
    ```

4.  **Build for production:**
    ```bash
    npm run build
    ```
    This creates an optimized build in the `dist/` directory.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

- **Lanyang Geothermal Corp.**
- **Lead Developer:** Han Lin <hotdogee@gmail.com> (https://github.com/hotdogee)
