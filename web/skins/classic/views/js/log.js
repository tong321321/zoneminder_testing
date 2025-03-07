const table = $j('#logTable');
var ajax = null;

/*
This is the format of the json object sent by bootstrap-table

var params =
{
"type":"get",
"data":
  {
  "search":"some search text",
  "sort":"DateTime",
  "order":"asc",
  "offset":0,
  "limit":25
  "filter":
    {
    "message":"some advanced search text"
    "level":"some more advanced search text"
    }
  },
"cache":true,
"contentType":"application/json",
"dataType":"json"
};
*/

// Called by bootstrap-table to retrieve zm log data
function ajaxRequest(params) {
  if ($j('#filterServerId').val()) {
    params.data.ServerId = $j('#filterServerId').val();
  }
  if ($j('#filterLevel').val()) {
    params.data.level = $j('#filterLevel').val();
  }
  if ($j('#filterComponent').val()) {
    params.data.Component = $j('#filterComponent').val();
  }
  if ($j('#filterStartDateTime').val()) {
    params.data.StartDateTime = $j('#filterStartDateTime').val();
  }
  if ($j('#filterEndDateTime').val()) {
    params.data.EndDateTime = $j('#filterEndDateTime').val();
  }

  if (ajax) ajax.abort();
  ajax = $j.ajax({
    url: thisUrl + '?view=request&request=log&task=query',
    data: params.data,
    timeout: 0,
    success: function(data) {
      if (!data.rows.length) {
        // If page is > 1, bt infinitely loops
        table.bootstrapTable('selectPage', 1);
      }
      // rearrange the result into what bootstrap-table expects
      params.success({
        total: data.total,
        totalNotFiltered: data.totalNotFiltered,
        rows: processRows(data.rows)
      });
      updateHeaderStats(data);
    },
    error: function(jqxhr) {
      logAjaxFail(jqxhr);
    }
  });
}

function processRows(rows) {
  $j.each(rows, function(ndx, row) {
    try {
      row.Message = decodeURIComponent(row.Message)
          .replace(/</g, "&lt;").replace(/>/g, "&gt;") // Replace link tags
          .replace(/event (\d+)/g, "<a href=\"?view=event&eid=$1\">event $1</a>");
    } catch (e) {
      console.log("Error decoding " + row.Message);
      // ignore errors
    }
  });
  return rows;
}

function filterLog() {
  table.bootstrapTable('refresh');
}

function updateHeaderStats(data) {
  var pageNum = table.bootstrapTable('getOptions').pageNumber;
  var pageSize = table.bootstrapTable('getOptions').pageSize;
  var startRow = ( (pageNum - 1 ) * pageSize ) + 1;
  var stopRow = pageNum * pageSize;
  var newClass = (data.logstate == 'ok') ? 'text-success' : (data.logstate == 'alert' ? 'text-warning' : ((data.logstate == 'alarm' ? 'text-danger' : '')));

  $j('#logState').text(data.logstate);
  $j('#logState').removeClass('text-success');
  $j('#logState').removeClass('text-warning');
  $j('#logState').removeClass('text-danger');
  $j('#logState').addClass(newClass);

  $j('#totalLogs').text(data.total);
  $j('#availLogs').text(data.totalNotFiltered);
  $j('#lastUpdate').text(data.updated);
  $j('#displayLogs').text(startRow + ' to ' + stopRow);
}

function initPage() {
  var backBtn = $j('#backBtn');

  // Init the bootstrap-table with custom icons
  table.bootstrapTable({icons: icons});

  // Assign inf, err, fat, dbg color classes to the rows in the table
  table.on('post-body.bs.table', function(data) {
    var lvl_ndx = $j('#logTable tr th').filter(function() {
      return $j(this).text().trim() == 'Level';
    }).index();

    $j('#logTable tr').each(function(ndx, row) {
      var row = $j(row);
      var level = row.find('td').eq(lvl_ndx).text().trim();

      if (( level == 'FAT' ) || ( level == 'PNC' )) {
        row.addClass('log-fat');
      } else if ( level == 'ERR' ) {
        row.addClass('log-err');
      } else if ( level == 'WAR' ) {
        row.addClass('log-war');
      } else if ( level == 'DBG' ) {
        row.addClass('log-dbg');
      }
    });
  });

  // Don't enable the back button if there is no previous zm page to go back to
  backBtn.prop('disabled', !document.referrer.length);

  // Manage the BACK button
  document.getElementById("backBtn").addEventListener("click", function onBackClick(evt) {
    evt.preventDefault();
    window.history.back();
  });

  // Manage the REFRESH Button
  document.getElementById("refreshBtn").addEventListener("click", function onRefreshClick(evt) {
    evt.preventDefault();
    window.location.reload(true);
  });

  $j('#filterStartDateTime, #filterEndDateTime')
      .datetimepicker({timeFormat: "HH:mm:ss", dateFormat: "yy-mm-dd", maxDate: 0, constrainInput: false, onClose: filterLog});
  $j('#filterServerId')
      .on('change', filterLog);
  $j('#filterComponent')
      .on('change', filterLog);
}

$j(document).ready(function() {
  initPage();
});
