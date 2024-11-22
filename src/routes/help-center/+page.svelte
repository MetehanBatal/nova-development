<script>
    import { user } from '../../stores/user';
    
    let videos = [
        {
            id: 'bfb098a1c7c649ec921bf2b3c557e930?sid=8e865f2a-6f8b-4e59-bc27-3f78a5b49a02',
            thumbnail: '',
            type: 'Experiments',
            title: 'Creating a new experiment',
            playing: false
        },
        {
            id: '',
            thumbnail: '',
            type: 'Experiments',
            title: 'Viewing the results',
            playing: false
        },
        {
            id: '',
            thumbnail: '',
            type: 'CMS',
            title: 'Adding new component',
            playing: false
        },
        {
            id: '',
            thumbnail: '',
            type: 'CMS',
            title: 'Changing static content',
            playing: false
        },
        {
            id: '',
            thumbnail: '',
            type: 'Audiences',
            title: 'Audiences',
            playing: false
        },
        {
            id: '',
            thumbnail: '',
            type: 'Purchases',
            title: 'Purchases',
            playing: false
        },
        {
            id: '',
            thumbnail: '',
            type: 'General',
            title: 'Adding a new member',
            playing: false
        },
        {
            id: '',
            thumbnail: '',
            type: 'Performance',
            title: 'Performance',
            playing: false
        }
    ];
    
    let videoEl;
    
    function handleVideoPlay(index) {
        if (!videos[index].playing) {
            $user.notifications.push(`VideoPlayed: ${videos[index].title} - ${Date.now()}`);
            
            var apiHeaders = new Headers();
                apiHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    
            var urlencoded = new URLSearchParams();
            for (const key in $user) {
                urlencoded.append(key, $user[key]);
            }
    
            var requestOptions = {
                method: 'PUT',
                headers: apiHeaders,
                body: urlencoded,
                redirect: 'follow'
            };
    
            fetch("https://mve.novus.studio/prod/users/update", requestOptions)
                .then(response => response.json())
                .then(result => {})
                .catch(error => console.error('error', error));
        }
    
        videos.forEach((video) => video.playing = false);
        videos[index].playing = true;
    };
</script>

<div class="cards-wrapper">
    {#each videos as video, _index}
    <div on:click={(e) => {handleVideoPlay(_index)}} class="experiment-card">
        <div class="experiment-bg-image">
            <div style="position: relative; padding-bottom: 64.90384615384616%; height: 0;"><iframe bind:this={videoEl} src={`https://www.loom.com/embed/${video.id}`} frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe></div>
        </div>

        {#if video.playing === false}
        <div class="experiment-top">
            <div class="experiment-badge bg-purple">
                {video.type}
            </div>

            <p>
                {video.title}
            </p>
        </div>
        {/if}
    </div>
    {/each}

    {#each Array(6) as _, index}
    <div class="experiment-card empty-bg"></div>
    {/each}
</div>
        



<style>
    .cards-wrapper {
        display: flex;
        flex-wrap: wrap;
        gap: 2.4rem;

        width: 100%;
        
        margin-top: 2.4rem;

        padding: 3.2rem;
    }

    .experiment-card {
        padding: 0;
    }

    .experiment-bg-image {
        width: 100%;
        height: 100%;
    }

    .experiment-top {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;

        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;

        height: 100%;
        width: 100%;

        padding: 3.2rem;

        background-color: rgba(0, 0, 0, .72);
        
        z-index: 1;
        
        border-radius: 1.6rem;
        overflow: hidden;

        /*pointer-events: none;*/
    }
</style>