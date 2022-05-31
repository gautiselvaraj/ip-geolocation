<script>
    import { onMount } from 'svelte';

    let clientDate = new Date();
    let geolocation = null;
    let ipaddresses = [];

    onMount(() => {
        navigator.geolocation.getCurrentPosition((pos) => {
            geolocation = pos;
        }, (err) => {
            console.warn(err.code + ": " + err.message);
        }, {
            enableHighAccuracy: true,
            timeout: 3000,
            maximumAge: 0
        });

        getIPs().then((res) => {
            ipaddresses = res;
        });
    });
</script>

<p>Client OS Date: {clientDate}</p>
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
{#if ipaddresses !== null} 
    <p>Available Client IP Addresses: </p>
    <ul>
        {#each ipaddresses as ipaddress}
            <li>{ipaddress}</li>
        {/each}
    </ul>
{/if}
