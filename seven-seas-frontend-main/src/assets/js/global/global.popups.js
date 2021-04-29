/*----------------
    POPUPS 
----------------*/

function initPopups() {
  app.plugins.createPopup({
    container: '.popup-video',
    trigger: '.popup-video-trigger',
    sticky: true,
    overlay: {
      color: '21, 21, 31',
      opacity: .96
    },
    animation: {
      type: 'translate-in-fade',
      speed: .3,
      translateOffset: 40
    }
  });

  app.plugins.createPopup({
    container: '.popup-picture',
    trigger: '.popup-picture-trigger',
    sticky: true,
    overlay: {
      color: '21, 21, 31',
      opacity: .96
    },
    animation: {
      type: 'translate-in-fade',
      speed: .3,
      translateOffset: 40
    }
  });

  app.plugins.createPopup({
    container: '.popup-album-creation',
    trigger: '.popup-album-creation-trigger',
    overlay: {
      color: '21, 21, 31',
      opacity: .96
    },
    animation: {
      type: 'translate-in-fade',
      speed: .3,
      translateOffset: 40
    }
  });

  app.plugins.createPopup({
    container: '.popup-event-creation',
    trigger: '.popup-event-creation-trigger',
    overlay: {
      color: '21, 21, 31',
      opacity: .66
    },
    animation: {
      type: 'translate-in-fade',
      speed: .3,
      translateOffset: 40
    }
  });

  app.plugins.createPopup({
    container: '.popup-event-information',
    trigger: '.popup-event-information-trigger',
    overlay: {
      color: '21, 21, 31',
      opacity: .96
    },
    animation: {
      type: 'translate-in-fade',
      speed: .3,
      translateOffset: 40
    }
  });

  app.plugins.createPopup({
    container: '.popup-manage-group',
    trigger: '.popup-manage-group-trigger',
    overlay: {
      color: '21, 21, 31',
      opacity: .96
    },
    animation: {
      type: 'translate-in-fade',
      speed: .3,
      translateOffset: 40
    }
  });

  app.plugins.createPopup({
    container: '.popup-manage-item',
    trigger: '.popup-manage-item-trigger',
    overlay: {
      color: '21, 21, 31',
      opacity: .7
    },
    animation: {
      type: 'translate-in-fade',
      speed: .3,
      translateOffset: 40
    }
  });

  app.plugins.createPopup({
    container: '.popup-edit-hosting',
    trigger: '.popup-edit-hosting-trigger',
    overlay: {
      color: '21, 21, 31',
      opacity: .96
    },
    animation: {
      type: 'translate-in-fade',
      speed: .3,
      translateOffset: 40
    }
  });

  app.plugins.createPopup({
    container: '.popup-edit-boat',
    trigger: '.popup-edit-boat-trigger',
    overlay: {
      color: '21, 21, 31',
      opacity: .96
    },
    animation: {
      type: 'translate-in-fade',
      speed: .3,
      translateOffset: 40
    }
  });
  app.plugins.createPopup({
    container: '.popup-edit-equipment',
    trigger: '.popup-edit-equipment-trigger',
    overlay: {
      color: '21, 21, 31',
      opacity: .96
    },
    animation: {
      type: 'translate-in-fade',
      speed: .3,
      translateOffset: 40
    }
  });

  app.plugins.createPopup({
    container: '.popup-manage-boat',
    trigger: '.popup-manage-boat-trigger',
    overlay: {
      color: '21, 21, 31',
      opacity: .7
    },
    animation: {
      type: 'translate-in-fade',
      speed: .3,
      translateOffset: 40
    }
  });

  app.plugins.createPopup({
    container: '.popup-review',
    trigger: '.popup-review-trigger',
    overlay: {
      color: '21, 21, 31',
      opacity: .96
    },
    animation: {
      type: 'translate-in-fade',
      speed: .3,
      translateOffset: 40
    }
  });


  /*--------------------------
      PICTURE POPUP RESIZE
  --------------------------*/
  app.querySelector('.popup-picture', function (el) {
    const popup = el[0],
      widgetBoxScrollable = popup.querySelector('.widget-box-scrollable'),
      postCommentForm = popup.querySelector('.post-comment-form');

    const updateWidgetBoxScrollableDimensions = function () {
      widgetBoxScrollable.style.height = `${popup.offsetHeight - postCommentForm.offsetHeight}px`;
    };

    updateWidgetBoxScrollableDimensions();
    window.addEventListener('resize', updateWidgetBoxScrollableDimensions);
  });
}
