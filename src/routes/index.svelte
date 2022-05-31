<script>
    import { onMount } from 'svelte';
    import tzlookup from 'tz-lookup';
    import { IPAddress } from '$lib/scripts/lib.js';

    let clientDate = null;
    let clientTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    let clientFormatter = new Intl.DateTimeFormat([], { dateStyle: 'full', timeStyle: 'long' });
    let promise = null;

    onMount(() => {
        clientDate = new Date();
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
                                            dateStyle: 'full',
                                            timeStyle: 'long'
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
                                                                    formatter.format(clientDate)
                                                            );
                                    }
                                );
            return detail;
        });

        return ipaddresses;
    };


</script>

{#if clientDate !== null}
<p>Client OS Date: {clientFormatter.format(clientDate)}</p>
<p>Client Timezone: {clientTimeZone}</p>
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
