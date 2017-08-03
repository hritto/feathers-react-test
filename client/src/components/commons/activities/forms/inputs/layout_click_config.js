

const layout_click_config = function(){

  const landscapeConfigUp = () => {
    return {
        question: {
        size: {
          w: 950,
          h: 100
        },
        pos: {
          x: 0,
          y: 0
        }
      },
      elements_container: {
        size: {
          w: 950,
          h: 450
        },
        pos: {
          x: 0,
          y: 100
        }
      }
    }
  };

  const landscapeConfigDown = () => {
    return {
      question: {
        size: {
          w: 950,
          h: 100
        },
        pos: {
          x: 0,
          y: 450
        }
      },
      elements_container: {
        size: {
          w: 950,
          h: 450
        },
        pos: {
          x: 0,
          y: 0
        }
      }
    };
  };

  const portraitConfigLeft = () => {
    return {
      question: {
        size: {
          w: 100,
          h: 550
        },
        pos: {
          x: 0,
          y: 0
        }
      },
      elements_container: {
        size: {
          w: 850,
          h: 550
        },
        pos: {
          x: 100,
          y: 0
        }
      }
    };
  };

  const portraitConfigRight = () => {
    return {
      question: {
        size: {
          w: 100,
          h: 550
        },
        pos: {
          x: 850,
          y: 0
        }
      },
      elements_container: {
        size: {
          w: 850,
          h: 550
        },
        pos: {
          x: 0,
          y: 0
        }
      }
    };
  };

  const configFree = () => {
    return {
      question: {
        size: {
          w: 100,
          h: 100
        },
        pos: {
          x: 0,
          y: 0
        }
      },
      elements_container: {
        size: {
          w: 950,
          h: 550
        },
        pos: {
          x: 0,
          y: 0
        }
      }
    };
  };


  return {
    landscapeConfigUp: landscapeConfigUp,
    landscapeConfigDown: landscapeConfigDown,
    portraitConfigLeft: portraitConfigLeft,
    portraitConfigRight: portraitConfigRight,
    configFree: configFree
  }
}

export default layout_click_config;
