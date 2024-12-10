<div class="nsuk-spinner" role="status">
  <span class="nsuk-visually-hidden">Loading...</span>
</div>

<style lang="scss">
  .nsuk-spinner {
    display: inline-block;
    height: 12px;
    width: 12px;
    border-radius: 50%;
    border: 2px solid currentColor;
    border-right-color: gray;
    text-align: -0.125em;
    animation: spin 1.5s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .nsuk-visually-hidden {
    position: absolute !important;
    margin: -1px !important;
    height: 1px !important;
    width: 1px !important;
    overflow: hidden !important;
    clip: rect(0, 0, 0, 0) !important;
    border: 0 !important;
    padding: 0 !important;
    white-space: nowrap !important;
  }
</style>
