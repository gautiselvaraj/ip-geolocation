<script>
    import { onMount } from 'svelte';
    import * as tzlookup from 'tz-lookup';
    import { IPAddress } from '$lib/scripts/lib.js';

    let clientDate = null;
    let clientTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    let geolocation = null;
    let promise = null;

    onMount(() => {
        clientDate = new Date();
        navigator.geolocation.getCurrentPosition((pos) => {
            geolocation = pos;
        }, (err) => {
            console.warn(err.code + ": " + err.message);
        }, {
            enableHighAccuracy: true,
            timeout: 3000,
            maximumAge: 0
        });

        promise = getIPTypes().then(async res => getIPDetails(res));
    });

    const getIPDetails = async (res) => {
        let ipaddresses = await res.map(async (ipaddress) => {
            let detail = await fetch('https://geolocation-db.com/json/' + ipaddress.ip)
                         .then(response => response.json())
                         .then(data => {
                                        const timezone = tzlookup(data.latitude, data.longitude);
                                        const option = {
                                            timeZone: timezone,
                                            year: 'numeric',
                                            month: 'numeric',
                                            day: 'numeric',
                                            hour: 'numeric',
                                            minute: 'numeric',
                                            second: 'numeric',
                                        };
                                        const formatter = new Intl.DateTimeFormat([], option);
                                        return new IPAddress(ipaddress.ip, 
                                                                    ipaddress.IPv4 ? "IPv4" : "IPv6", 
                                                                    data.latitude,
                                                                    data.longitude,
                                                                    timezone,
                                                                    data.state,
                                                                    data.city,
                                                                    data.postal,
                                                                    data.country_name,
                                                                    new Date(formatter.format(clientDate))
                                                            );
                                    }
                                );
            return detail;
        });

        return ipaddresses;
    };


</script>

{#if clientDate !== null}
<p>Client OS Date: {clientDate}</p>
<p>Client Timezone: {clientTimeZone}</p>
{/if}
<br />
{#if geolocation !== null} 
    <p>Location at {new Date(geolocation.timestamp)} :</p>
    <ul>
        <li>Longitude: {geolocation.coords.longitude}</li>
        <li>Latitude: {geolocation.coords.latitude}</li>
        <li>Accuracy: within {geolocation.coords.accuracy} meters</li>
    </ul>
{/if}
<br />
{#await promise then ipaddresses} 
    <p>Available Client IP Addresses: </p>
    <ul>
        {#if ipaddresses !== null}
            {#each ipaddresses as ipaddress}
                {#await ipaddress then value}
                    <li>
                        <span>{value.ipaddress}</span>
                        <ul>
                            <li>Type: {value.type}</li>
                            <li>Lattitude: {value.lattitude}</li>
                            <li>Longitude: {value.longitude}</li>
                            <li>Timezone: {value.timezone}</li>
                            <li>State: {value.state}</li>
                            <li>City: {value.city}</li>
                            <li>Postal Code: {value.postal}</li>
                            <li>Country: {value.country}</li>
                            <li>Date: {value.date}</li>
                            <li>Is Same Timezone: {value.timezone === clientTimeZone}</li>
                        </ul>
                    </li>
                {/await}
            {/each}
        {/if}
    </ul>
{/await}
