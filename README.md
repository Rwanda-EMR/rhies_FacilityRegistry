# Facility Registry Server
The Facility Registry Server implementation using DHIS2 for the RHIES project

### Prerequisites ###
- NodeJs
- MongoDb


### build and run ###
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


