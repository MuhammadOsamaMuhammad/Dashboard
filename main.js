// getting the divs indecator 
let studentIndecator = document.getElementById('studentNumber')
let schoolIndecator = document.getElementById('schoolNumber')

// Load the Visualization API and the corechart package.
google.charts.load('current', {'packages':['corechart']});

// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(drawChart);


require(["esri/config", "esri/Map", "esri/views/MapView","esri/widgets/Home","esri/layers/FeatureLayer"
,"esri/widgets/ScaleBar","esri/request","esri/rest/support/Query",
"esri/rest/support/StatisticDefinition"],
 (esriConfig, Map, MapView,Home,FeatureLayer,ScaleBar,esriRequest,Query,StatisticDefinition) =>{

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

// width and length of the charts
let width = 272;
let height = 280;
let backgroundColor = "#3f3f3f"
let titleTextStyle = {
  color: "white",                
  fontSize: 25,               
  bold: true
}
//querying the data and grouping values using the STATE field 
  let stateQuery = new Query();

  stateQuery.outStatistics = [{
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
  ];

  stateQuery.groupByFieldsForStatistics = [ "STATE" ];
  
layer.queryFeatures(stateQuery).then((s)=>{
    /////// state students and state schools to collect data and visualized as charts
    let stateStudents = []
    let stateSchools = []
    let features = s.features
    ///////////
    let studentNumber = 0;
    let schoolsNumber = 0
    // sorting data to give more insights about the data when visualized
    let sortedData = features.sort(
      (f1, f2) => (f1.attributes.Number_of_students_in_states < f2.attributes.Number_of_students_in_states) ? 1 :
       (f1.attributes.Number_of_students_in_states > f2.attributes.Number_of_students_in_states) ? -1 : 0);    
    
       for (const sortedData of features) {
      //// calculate the number of students and schools in the data
      studentNumber += sortedData.attributes.Number_of_students_in_states
      schoolsNumber += sortedData.attributes.Number_of_schools_in_states
      /////////
      stateStudents.push([sortedData.attributes.STATE,sortedData.attributes.Number_of_students_in_states])
      stateSchools.push([sortedData.attributes.STATE,sortedData.attributes.Number_of_schools_in_states])
    }   

    //populate the indecators with data
    studentIndecator.textContent = `${studentNumber} Student`;
    schoolIndecator.textContent = `${schoolsNumber} School`;

  function drawChart(){
      
  // Create the data table.
  let data = new google.visualization.DataTable();
  data.addColumn('string', "State");
  data.addColumn('number', "Students Numbers");
  data.addRows(stateStudents
    );

  // Set chart options
  let options = {
    title:"Students per State",
    hAxis:{title:"Students"},
    vAxis:{title:"State"},
    width,
    height,
    colors: ['#ffaa00'],
    backgroundColor,
    titleTextStyle
  };

  // Instantiate and draw our chart, passing in some options.
  let chart = new google.visualization.BarChart(document.getElementById('state_students'));
  
  chart.draw(data, options);
  // chart2.draw(data2, options);
    }
    drawChart()

// Create the data table.
  let data2 = new google.visualization.DataTable();
  data2.addColumn('string', 'State');
  data2.addColumn('number', 'Schools Number');
  data2.addRows(stateSchools);

  // Set chart options
  let options2 = {
    title:"Schools per State",
    hAxis:{title:"Schools"},
    vAxis:{title:"State"},
    width,
    height,
    colors: ['#1a468d'],
    backgroundColor,
    titleTextStyle
  };

  // Instantiate and draw our chart, passing in some options.
  let chart = new google.visualization.BarChart(document.getElementById('state_schools'));
  
  chart.draw(data2, options2);
  });



  let cityQuery = new Query();

  cityQuery.outStatistics = [{
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
  ];

  cityQuery.groupByFieldsForStatistics = [ "CITY" ];


  layer.queryFeatures(cityQuery).then((s)=>{ 
    let cityStudents = []
    let citySchools = []
    let features = s.features

    let sortedData = features.sort(
      (f1, f2) => (f1.attributes.Number_of_students_in_cities < f2.attributes.Number_of_students_in_cities) ? 1 :
       (f1.attributes.Number_of_students_in_cities > f2.attributes.Number_of_students_in_cities) ? -1 : 0);    
    
       for (const sortedData of features) {
      cityStudents.push([sortedData.attributes.CITY,sortedData.attributes.Number_of_students_in_cities])
      citySchools.push([sortedData.attributes.CITY,sortedData.attributes.Number_of_schools_in_cities])
    }   

  function drawChart(){
      
  // Create the data table.
  let data = new google.visualization.DataTable();
  data.addColumn('string', "City");
  data.addColumn('number', "Cities Numbers");
  data.addRows(cityStudents
    );

  // Set chart options
  let options = {
    title:"Students per City",
    hAxis:{title:"Students"},
    vAxis:{title:"Cities"},
    width,
    height,
    colors: ['#5499c1'],
    backgroundColor,
    titleTextStyle
  };

  // Instantiate and draw our chart, passing in some options.
  let chart = new google.visualization.BarChart(document.getElementById('city_students'));
  
  chart.draw(data, options);

    }
    drawChart()

// Create the data table.
  let data2 = new google.visualization.DataTable();
  data2.addColumn('string', 'City');
  data2.addColumn('number', 'Schools Number');
  data2.addRows(citySchools);

  // Set chart options
  let options2 = {
    title:"Schools per City",
    titleTextStyle,
    hAxis:{title:"Schools"},
    vAxis:{title:"City"},
    width,
    height,
    colors: ['#578a3d'],
    backgroundColor,
    titleTextStyle
    };

  // Instantiate and draw our chart, passing in some options.
  let chart = new google.visualization.BarChart(document.getElementById('city_schools'));
  
  chart.draw(data2, options2);
});

});
function drawChart() {

}