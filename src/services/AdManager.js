/* global google */

export default class AdManager {
    constructor(adContainerId, adVideoElementId) {
        this.adContainer = document.getElementById(adContainerId);
        this.adVideoElement = document.getElementById(adVideoElementId);
    }

    // Show an advertisement and call the callback after it completes
    showAd(onAdComplete) {
        if (!this.adContainer || !this.adVideoElement) {
            console.error('Ad container or video element not found');
            return;
        }

        this.adContainer.classList.remove('hidden');

        // Initialize the ad display container
        const adDisplayContainer = new google.ima.AdDisplayContainer(
            this.adContainer,
            this.adVideoElement
        );
        adDisplayContainer.initialize();

        const adsLoader = new google.ima.AdsLoader(adDisplayContainer);

        // Handle the AdsManager loaded event
        adsLoader.addEventListener(
            google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
            (adsManagerLoadedEvent) => {
                const adsManager =
                    adsManagerLoadedEvent.getAdsManager(this.adVideoElement);

                adsManager.init(
                    this.adContainer.offsetWidth,
                    this.adContainer.offsetHeight,
                    google.ima.ViewMode.NORMAL
                );
                adsManager.start();

                // Handle ad completion event
                adsManager.addEventListener(
                    google.ima.AdEvent.Type.COMPLETE,
                    () => {
                        this.adContainer.classList.add('hidden');
                        onAdComplete(); // Callback after the ad finishes
                    }
                );
            }
        );

        // Request an ad
        const adsRequest = new google.ima.AdsRequest();
        adsRequest.adTagUrl =
            'https://pubads.g.doubleclick.net/gampad/ads?iu=/21775744923/external/single_ad_samples&sz=640x480&cust_params=sample_ct%3Dlinear&ciu_szs=300x250%2C728x90&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator=';

        adsLoader.requestAds(adsRequest);
    }
}
