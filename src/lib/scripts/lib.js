export class IPAddress {
    ipaddress = '';
    type = '';
    lattitude = 0;
    longitude = 0;
    timezone = '';
    state = '';
    city = '';
    postal = '';
    country = '';
    date = new Date();

    constructor(ipaddress, type, lattitude, longitude, timezone, state, city, postal, country, date) {
        this.ipaddress = ipaddress;
        this.type = type;
        this.lattitude = lattitude;
        this.longitude = longitude;
        this.timezone = timezone;
        this.state = state;
        this.city = city;
        this.postal = postal;
        this.country = country;
        this.date = date;
    }
}