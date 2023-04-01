require(["esri/config", "esri/Map", "esri/views/MapView","esri/widgets/Home","esri/layers/FeatureLayer"
,"esri/widgets/ScaleBar","esri/rest/support/Query","esri/core/reactiveUtils",],
 (esriConfig, Map, MapView,Home,FeatureLayer,ScaleBar,Query,reactiveUtils) =>{

  const indStudentsNumber = document.getElementById('studentNumber')
  const indSchoolsNumber = document.getElementById('schoolNumber')
    
    // The API key
    esriConfig.apiKey = "AAPK3542306035bb457b8cc0ab823c9916aaaj3_O9svoxs84438L7Nz_ARAeZrfccj2z39F3O58g6D0c0Gh_FTzThf0Sxh8-ggb";
    
    // The URL of the Feature Layer    
    let layerURL = "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/CollegesUniversities/FeatureServer/0";

    // The Pop up Content
    let popupContent = 
      `<table class = "popup">
          <tr>
            <th>Field</th>
            <th>Value</th>
          </tr>
          <tr>
            <td>Name</td>
            <td>{NAME}</td>
          </tr>
          <tr>
            <td>City</td>
            <td>{CITY}</td>
          </tr>
          <tr>
            <td>State</td>
            <td>{STATE}</td>
          </tr>
          <tr>
            <td>Country</td>
            <td>{COUNTRY}</td>
          </tr>
          <tr>
            <td>Address </td>
            <td>{ADDRESS}</td>
          </tr>
          <tr>
            <td>Address 2</td>
            <td>{ADDRESS2}</td>
          </tr>
          <tr>
            <td>ZIP</td>
            <td>{ZIP}</td>
          </tr>
          <tr>
            <td>ZIP4</td>
            <td>{ZIP4}</td>
          </tr>
          <tr>
            <td>Source</td>
            <td>SOURCE</td>
          </tr>
          <tr>
            <td>WEBSITE</td>
            <td>{WEBSITE}</td>
          </tr>
          </table>
          `;

    // The map object
    const map = new Map({
      basemap: "arcgis-dark-gray" // Basemap layer service
    });

    const view = new MapView({
      map: map,
      center: [-103, 44],
      zoom: 2,
      container: "map"
    });
    let homeWidget = new Home({
        view: view
      });


    view.ui.add(homeWidget, "top-right");

      
      const layer = new FeatureLayer({
        url: layerURL,
        popupTemplate:{
          title:"{NAME}",
          content:popupContent
        }
    });

    // the renderer object for how the feature is going to be displayed
    layer.renderer = {
        type: "simple",  
        symbol: {
          type: "simple-marker", 
          size: 6,
          color: "#69dcff",
              outline: {
                color: "rgba(0, 139, 174, 0.5)",
                width: 5
              }
        }
      };
 
 
    // featureReduction to create the clustering
layer.featureReduction = {
    type: "cluster",
    clusterRadius: "100px",
    clusterMinSize: "24px",
    clusterMaxSize: "60px",
    popupTemplate: {
      title: "Cluster summary",
      content: "This cluster represents {cluster_count} Colluage and School.",
      fieldInfos: [{
        fieldName: "cluster_count",
        format: {
          places: 0,
          digitSeparator: true
        }
      }]
    },
    labelingInfo: [{
      deconflictionStrategy: "none",
      labelExpressionInfo: {
        expression: "Text($feature.cluster_count, '#,###')"
      },
      symbol: {
        type: "text",
        color: "#004a5d",
              font: {
                weight: "bold",
                family: "Noto Sans",
                size: "12px"
              }
      },
      labelPlacement: "center-center",
    }]
  }

  let scaleBar = new ScaleBar({
    view: view,
    unit:"metric"
  });
  // Add widget to the bottom left corner of the view
  view.ui.add(scaleBar, {
    position: "bottom-left"
  });

  map.add(layer);


const definition = {
  type: 'bar',
  datasets: [{
    url: layerURL,
    query: {
      groupByFieldsForStatistics: 'STATE',
      outStatistics: [{
        'statisticType': 'count',
        'onStatisticField': 'FID',
        'outStatisticFieldName': 'Number_of_schools_in_states'
      }],
      orderByFields: 'Number_of_schools_in_states DESC'
    }
  }],
  series: [{
    category: {
      field: 'STATE',
      label: 'STATE'
    },
    value: {
      field: 'Number_of_schools_in_states',
      label: 'Number of Schools in State'
    }
  }]
};

const Number_of_schools_in_states = new cedar.Chart('state_schools', definition);
Number_of_schools_in_states.show();



const definition2 = {
  type: 'bar',
  datasets: [{
    url: layerURL,
    query: {
      groupByFieldsForStatistics: 'STATE',
      outStatistics: [{
        'statisticType': 'sum',
        'onStatisticField': 'TOT_ENROLL',
        'outStatisticFieldName': 'Number_of_students_in_states'
      }],
      orderByFields: 'Number_of_students_in_states DESC'
    }
  }],
  series: [{
    category: {
      field: 'STATE',
      label: 'STATE'
    },
    value: {
      field: 'Number_of_students_in_states',
      label: 'Number of Students in State'
    }
  }]
};

const Number_of_students_in_states = new cedar.Chart('state_students', definition2);

Number_of_students_in_states.show();





const definition3 = {
  type: 'bar',
  datasets: [{
    url: layerURL,
    query: {
      groupByFieldsForStatistics: 'CITY',
      outStatistics: [{
        'statisticType': 'sum',
        'onStatisticField': 'TOT_ENROLL',
        'outStatisticFieldName': 'Number_of_students_in_cities'
      }],
      orderByFields: 'Number_of_students_in_cities DESC'
    }
  }],
  series: [{
    category: {
      field: 'CITY',
      label: 'CITY'
    },
    value: {
      field: 'Number_of_students_in_cities',
      label: 'Number of Students in City'
    }
  }]
};



const Number_of_students_in_city = new cedar.Chart('city_students', definition3);
Number_of_students_in_city.show();



const definition4 = {
  type: 'bar',
  datasets: [{
    url: layerURL,
    query: {
      groupByFieldsForStatistics: 'CITY',
      outStatistics: [{
        'statisticType': 'count',
        'onStatisticField': 'FID',
        'outStatisticFieldName': 'Number_of_schools_in_cities'
      }],
      orderByFields: 'Number_of_schools_in_cities DESC'
    }
  }],
  series: [{
    category: {
      field: 'CITY',
      label: 'CITY'
    },
    value: {
      field: 'Number_of_schools_in_cities',
      label: 'Number of Schools in City'
    }
  }]
};

const Number_of_schools_in_cities = new cedar.Chart('city_schools', definition4);
Number_of_schools_in_cities.show();

const number_of_schools = new Query(
  {
      outStatistics: [{
        'statisticType': 'count',
        'onStatisticField': 'FID',
        'outStatisticFieldName': 'Number_of_schools_in_cities'
      }]
    }
    )
    
const number_of_students = new Query(
      {
          outStatistics: [{
            'statisticType': 'sum',
            'onStatisticField': 'TOT_ENROLL',
            'outStatisticFieldName': 'Number_of_schools_in_cities'
          }]
        }
        )
    
    
    

    
    
    const update = ()=>{

      Number_of_schools_in_states.datasets()[0].query.geometry = view.extent;
      Number_of_students_in_states.datasets()[0].query.geometry = view.extent;
      Number_of_students_in_city.datasets()[0].query.geometry = view.extent;
      Number_of_schools_in_cities.datasets()[0].query.geometry = view.extent;
      number_of_schools.geometry = view.extent;  
      number_of_students.geometry = view.extent;  
      
      
      
      Number_of_students_in_states.show();
      Number_of_schools_in_states.show();
      Number_of_students_in_city.show();
      Number_of_schools_in_cities.show();

      Promise.all([layer.queryFeatures(number_of_schools),layer.queryFeatures(number_of_students)]).then(data=>{        
      indStudentsNumber.textContent = `${data[0].features[0].attributes.Number_of_schools_in_cities} School`

      if ((data[1].features[0].attributes.Number_of_schools_in_cities/ 1000) > 1000) {
        indSchoolsNumber.textContent = `${(data[1].features[0].attributes.Number_of_schools_in_cities/ 1000).toFixed(0)}K Student`
        
      } else {
        indSchoolsNumber.textContent = `${data[1].features[0].attributes.Number_of_schools_in_cities} Student`
      }
      })
    }

reactiveUtils.watch(
  // getValue function
  () => view.updating,
  // callback
  async (updating) => {
    if (!updating) update()
  }
  );





});

