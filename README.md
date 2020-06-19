# rhies_FacilityRegistry
This repository contains the Facility Registry Server implementation using DHIS2 for the RHIES project.

## RHIES Project
The purpose of Rwandan Health Information Exchange System (RHIES) project is to develop a system that allows for information- exchange within electronic medical record systems and to develop linkage solutions for generating EMR data directly to HMIS in the specific use case of HIV Case based surveillance (CBS). RHIES is a set of applications that work together in the Open Health Information Exchange (OpenHIE) architecture to serve point-of-service systems, like EMRs, DHIS2, National ID database and laboratory information system.

### Prerequisites
- Node.js
- MongoDB

### Build and run
* Start by cloning the project 
``` git clone https://github.com/savicsorg/rhies_FacilityRegistry.git ``` 

* Run the following command to start your server:
```
npm start
```

* Point your browser to the following URL to have all the facilities:
```
http://localhost:4009/facilityregistry
```

* If you need to sort by FOSA CODE, point your browse to the following endpoint:
```
http://localhost:4009/facilityregistry/fosa/"your_fosacode"
```

## Documentation
[Wiki](https://github.com/savicsorg/rhies_FacilityRegistry/wiki)

## Licence
Proprietary.

## Created and Developed By
[Savics SRL](https://savics.org)

## In Collaboration with
[Rwanda Biomedical Centre (RBC)](https://www.rbc.gov.rw/)

### Main Contributors ###
* Developers: Mamadou Ben TRAORE, Mohamed Bachir DIOUF
