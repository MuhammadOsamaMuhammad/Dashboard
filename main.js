// // getting the divs indecator 
let studentIndecator = document.getElementById('studentNumber')
let schoolIndecator = document.getElementById('schoolNumber')
function drawChart(){}
// // Load the Visualization API and the corechart package.
google.charts.load('current', {'packages':['corechart']});

// // Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(drawChart);


require(["esri/config", "esri/Map", "esri/views/MapView","esri/widgets/Home","esri/layers/FeatureLayer"
,"esri/widgets/ScaleBar","esri/rest/support/Query",
"esri/rest/support/StatisticDefinition","esri/core/reactiveUtils",],
 (esriConfig, Map, MapView,Home,FeatureLayer,ScaleBar,Query,StatisticDefinition,reactiveUtils) =>{
  
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



// chart options
let width = 272;
let height = 280;
let backgroundColor = "#3f3f3f"
let titleTextStyle = {
  color: "white",                
  fontSize: 25,               
  bold: true
}

function drawChart(chartdata,columnTitle,columnValueTitle,chartTitle,hAxisTitle,vAxisTitle,color,idContainer){
  // Create the data table.
  const sortedData = chartdata.sort((a, b) => b[1] - a[1])

  let data = new google.visualization.DataTable();
  data.addColumn('string', columnTitle); // "State"
  data.addColumn('number', columnValueTitle); //"Students Numbers"
  data.addRows(sortedData
    );
  // Set chart options
  let options = {
    title: chartTitle, //"Students per State"
    hAxis:{title:hAxisTitle}, //"Students"
    vAxis:{title:vAxisTitle}, // State
    width,
    height,
    colors: [color],
    backgroundColor,
    titleTextStyle
  };
  // Instantiate and draw our chart, passing in some options.
  let chartContainer = document.getElementById(idContainer)
  chartContainer.innerHTML = "";
  let chart = new google.visualization.BarChart(chartContainer);
  
  chart.draw(data, options);
    }


function queryData(extent){
  const stateQuery = new Query(
    {
  groupByFieldsForStatistics : [ "STATE" ],
  geometry : extent,
  spatialRelationship: "envelope-intersects",
  returnGeometry : true,
  outStatistics : [{
    onStatisticField: "FID",
    outStatisticFieldName: "Number_of_schools_in_states",
    statisticType: "count"
  } 
  ,
  {
    onStatisticField: "TOT_ENROLL",
    outStatisticFieldName: "Number_of_students_in_states",
    statisticType: "sum"
  }
  ]

    }
    )
    cityQuery = new Query(
      {
    groupByFieldsForStatistics : [ "CITY" ],
    geometry : extent,
    spatialRelationship: "envelope-intersects",
    returnGeometry : true,
    outStatistics : [{
      onStatisticField: "FID",
      outStatisticFieldName: "Number_of_schools_in_cities",
      statisticType: "count"
    } 
    ,
    {
      onStatisticField: "TOT_ENROLL",
      outStatisticFieldName: "Number_of_students_in_cities",
      statisticType: "sum"
    }
    ]
  
      }
  
  );
  
   layer.queryFeatures(stateQuery).then(function(response){
  let students = []
  let schools = []
  let features = response.features
  ///////////
  let studentNumber = 0;
  let schoolsNumber = 0
     for (const feature of features) {
    //// calculate the number of students and schools in the data
    studentNumber += feature.attributes.Number_of_students_in_states
    schoolsNumber += feature.attributes.Number_of_schools_in_states
    /////////
    students.push([feature.attributes.STATE,feature.attributes.Number_of_students_in_states])
    schools.push([feature.attributes.STATE,feature.attributes.Number_of_schools_in_states])
  }   

  //populate the indecators with data
  studentIndecator.textContent = `${studentNumber} Student`;
  schoolIndecator.textContent = `${schoolsNumber} School`;

          // chartdata,columnTitle,columnValueTitle,chartTitle,hAxisTitle,vAxisTitle,idContainer
  drawChart(students,"State","Students Numbers","Students per State","Students","State",'red','state_students') // student state
  drawChart(schools,"School","Schools Numbers","Schools per State","Schools","State",'blue','state_schools')   // school state

});  
   layer.queryFeatures(cityQuery).then(function(response){
  let students = []
  let schools = []
  let features = response.features

   
     for (const feature of features) {
    students.push([feature.attributes.CITY,feature.attributes.Number_of_students_in_cities])
    schools.push([feature.attributes.CITY,feature.attributes.Number_of_schools_in_cities])
  }   
  drawChart(students,"School","Schools Numbers","Schools per city","Schools","State",'yellow','city_students') //student city 
  drawChart(schools,"School","Schools Numbers","Schools per city","Schools","State",'green','city_schools') //school city
});  
}

reactiveUtils.watch(
  () => view?.extent,
  (extent) => {
   queryData(extent)
  });
});