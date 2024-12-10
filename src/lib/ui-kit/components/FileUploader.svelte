<script lang="ts">
  import { createEventDispatcher, tick } from 'svelte';
  import Icon from '@iconify/svelte';

  const dispatch = createEventDispatcher();

  let uploadProgress = 0;
  let uploading = false;

  async function handleFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      await tick();
      uploading = true;
      const fileData = await readFileWithProgress(input.files[0]);
      uploading = false;
      dispatch('file', fileData);
    }
  }

  async function readFileWithProgress(file: File): Promise<{ src: string }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onprogress = function (event) {
        if (event.lengthComputable) {
          uploadProgress = Math.round((event.loaded / event.total) * 100);
        }
      };

      reader.onload = function (event) {
        if (event.target && event.target.result) {
          const fileData = {
            src: event.target.result as string
          };
          resolve(fileData);
        } else {
          reject(new Error('File read failed'));
        }
      };

      reader.onerror = function () {
        console.error('Error reading file');
        reject(new Error('Error reading file'));
      };

      uploadProgress = 0;
      reader.readAsDataURL(file);
    });
  }
</script>

<button class="nsuk-uploader">
  <input type="file" on:change={handleFileChange} />
  {#if uploading}
    <div class="nsuk-progress">
      <div class="nsuk-progress-inner">{uploadProgress}%</div>
      <div
        class="nsuk-progress-ring"
        style="background: conic-gradient(from 180deg, #0CB47F {uploadProgress * 3.6}deg, #212830 0deg);"
      ></div>
    </div>
  {:else}
    <span class="nsuk-uploader-icon">
      <Icon icon="icon-park-outline:upload-two" width="20" height="20" style="color: #88888a" />
    </span>
  {/if}
  <div class="nsuk-uploader-text">
    <div>
      <span>Click to upload</span>
      <span>or drag and drop</span>
    </div>
    <div>SVG, PNG, JPG or GIF (max. 800x400px)</div>
  </div>
</button>

<style lang="scss">
  .nsuk-uploader {
    max-width: 428px;
    width: 100%;
    height: 144px;
    border-radius: 8px;
    background-color: #12151d;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    border: 1px dashed transparent;
    padding: 5px 20px;

    &:focus-within {
      border: 1px dashed var(--ns-main-purple-color);
    }

    &-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: var(--ns-border-color);
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 16px;
    }

    &-text {
      font-size: 14px;
      font-weight: 500;
      color: var(--ns-text-gray-color);
      text-align: center;

      div:first-of-type {
        margin-bottom: 10px;

        span:first-of-type {
          color: var(--ns-main-purple-color);
          font-weight: bold;
        }
      }

      div:last-of-type {
        font-size: 12px;
        font-weight: 400;
      }
    }

    input[type='file'] {
      position: absolute;
      max-width: 428px;
      width: 100%;
      height: 144px;
      border-radius: 8px;
      opacity: 0;
      cursor: pointer;
    }
  }

  .nsuk-progress {
    position: relative;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    margin-bottom: 16px;

    &-inner {
      position: relative;
      z-index: 1;
      font-size: 12px;
      font-weight: 400;
    }

    &-ring {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      padding: 8px;
      box-sizing: border-box;
      background: conic-gradient(from 180deg, #0cb47f 0deg, #212830 0deg);
    }

    &-ring::before {
      content: '';
      position: absolute;
      top: 4px;
      left: 4px;
      width: calc(100% - 8px);
      height: calc(100% - 8px);
      border-radius: 50%;
      background-color: #12151d;
    }
  }
</style>
