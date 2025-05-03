# SCADA/IoT Human Machine Interface (HMI)

> A modern cross-platform, responsive Human-Machine Interface (HMI) designed for real-time monitoring, historical data analysis, and control of a research-grade geothermal power plant in Taiwan. It leverages the Total Flow cycle to extract energy directly from the two-phase geothermal fluid.

![Real-time Monitor](https://github.com/user-attachments/assets/b178e905-4e73-49ac-8b37-0e820c9cf8fe)

## Table of Contents

- [SCADA/IoT Human Machine Interface (HMI)](#scadaiot-human-machine-interface-hmi)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Key Features](#key-features)
  - [Development Workflow](#development-workflow)
  - [License](#license)
  - [Contact](#contact)

## Overview

The system facilitates:

- Real-time monitoring and statistics of key geothermal parameters: Well enthalpy, Thermal efficiency, Fluid Temperature, Pipe Pressure, Mass Flow Rate.
- Real-time monitoring of electrical parameters: Three Phase Power, Voltage, Current, Frequency, Harmonics.
- Fast historic data viewing and analysis capabilities for large datasets (>1 billion points).

This system was developed as part of Taiwan's Total Flow Geothermal Power System project, demonstrating the integration of modern web technologies with a PWA frontend (VueJS), a real-time backend (NodeJS with WebSockets) and NoSQL databases (MongoDB) with on-site software-defined PLCs (Raspberry Pi) for interfacing with sensors and actuators for advanced SCADA/IoT applications.

## Key Features

- **Real-time Data Display:**
  - Fluid Temperature (°C)
  - Pipe Pressure (bar)
  - Mass Flow Rate (ton/hr, LPM)
  - Well Enthalpy (kJ/kg)
  - Overall Thermal Efficiency (%)
  - Three Phase Power (kW, kVA, kVAR)
  - Voltage (V) & Current (A) per phase
  - Frequency (Hz)
  - Power Factor (PF)
  - Power Harmonics Analysis
  - RPM
- **Historical Data Analysis:** Fast, interactive charts for exploring trends and diagnosing past events.
- **Progressive Web App (PWA):** Installable on various devices for a native-like experience.

![architecture-diagram](https://github.com/user-attachments/assets/dbdecedd-dfca-4188-955a-7ce15d3ccca2)

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
