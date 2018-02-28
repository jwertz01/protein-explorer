var selection = [-1,-1];
var cutoff = {'mod':0,'coverage':.4};
var logscale = {'mod':false,'coverage':false};
// var display_annotations = [false,false,false,false,false,false,false];
/* var annotation_colors = ["blue","red","green","black","gray","teal","purple"]; */
// var annotation_colors = ["red","orange","gold","green","blue","purple","hotpink"];
// var annotation_list = ["Modified residue","Active site","Binding site","Disulfide bond","Glycosylation","Metal binding","Natural variant"];
// var annotation_to_pos = {"Modified residue":0,"Active site":1,"Binding site":2,"Disulfide bond":3,"Glycosylation":4,"Metal binding":5,"Natural variant":6};
var seq;

function updateAnnotations() {
  draw_sequence(seq,selection);
}

function updateCutoff(cutoff_id) {
  cutoff[cutoff_id] = parseFloat(document.getElementById("cutoff_percent_" + cutoff_id).value);
  updateGradient(cutoff_id);
  draw_sequence(seq,selection);
}

function setLogscale(logscale_id) {
  logscale[logscale_id] = !logscale[logscale_id];
  draw_sequence(seq,selection);
}

function setSelection() {
  var url_string = window.location.href
  var url = new URL(url_string);
  var selection_start = parseInt(url.searchParams.get("start"));
  var selection_end = parseInt(url.searchParams.get("end"));
  if (selection_start + selection_end > 1 && selection_end > selection_start) {
    if (selection_start <= 0) {
      selection_start = 1;
    }
    if (selection_end > seq.characters.length) {
      selection_end = seq.characters.length
    }
    selection = [selection_start-1, selection_end-1];
  }
}

function updateGradient(gradient_id) {
  var start_color = document.getElementById("styleInputStart_" + gradient_id).style.backgroundColor;
  var end_color = document.getElementById("styleInputEnd_" + gradient_id).style.backgroundColor;
  var percent = 100*cutoff[gradient_id];
  var percent_start = Math.max(100*cutoff[gradient_id]-3,0);
  document.getElementById("gradient_" + gradient_id).style.background = "linear-gradient(to right, lightgray, lightgray "
  + percent_start + "%, white "
  + percent_start + "%, white "
  + percent + "%," + start_color + " " + percent + "%," + end_color + ")";
  draw_sequence(seq,selection);
}

function set_seq(on_set) {
  var url_string = window.location.href
  var url = new URL(url_string);
  var c = url.searchParams.get("protein");
  var task = url.searchParams.get("task");
  var query = encodeURIComponent(encodeURIComponent("#{\"ProteinID_input\":\"" + c + "\"}"))
  var other_params = "&pageSize=30&offset=0&_=1519340865710"
  var proteosafe_url_start = "https://proteomics2.ucsd.edu/ProteoSAFe/QueryResult?"
  var complete_url = proteosafe_url_start + "task=" + task + "&file=" + file + "&query=" + query + other_params;
  // var test_url = "mock_proteosafe.json"
  fetch(complete_url)
  // fetch(test_url)
  .then(
    function(response) {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' +
          response.status);
        return;
      }
      // Examine the text in the response
      response.json().then(function(data) {
        seq = JSON.parse(decodeURIComponent(data["row_data"][0]["ProteinExpression"]));
        console.log(seq);
        on_set();
      })
    }
  )
  .catch(function(err) {
    console.log('Fetch Error :-S', err);
  });
  // seq = all_seq[c];
  document.getElementById("title").innerHTML = c;
}

function display_position(pos,character) {
  var message_html = document.getElementById("messages");
  message_html.className = "serif";
  message_html.innerHTML = "Clicked on amino acid " + character  + " at position " + (pos+1);
}

function swap_clicked(is_clicked, object) {
  if (is_clicked) {
    object.style.backgroundColor = 'white';
  } else {
    object.style.backgroundColor = 'lightgray';
  }
}

function level_to_color(level,type) {
  var rgb = [211,211,211];
  if (type == 'mod') {
    var rgb = [255,255,255];
  }
  if (level >= cutoff[type] && cutoff[type] != 1) {
    level = (level - cutoff[type])/(1-cutoff[type]);
    var color2 = document.getElementById("styleInputStart_" + type).style.backgroundColor.replace(/[^\d,]/g, '').split(',');
    var color1 = document.getElementById("styleInputEnd_" + type).style.backgroundColor.replace(/[^\d,]/g, '').split(',');
    if (logscale[type]) {
      level = Math.log10(level * 9 + 1)
    }
    var w = level * 2 - 1;
    var w1 = (w/1+1) / 2;
    var w2 = 1 - w1;
    rgb = [Math.round(parseInt(color1[0]) * w1 + parseInt(color2[0]) * w2),
        Math.round(parseInt(color1[1]) * w1 + parseInt(color2[1]) * w2),
        Math.round(parseInt(color1[2]) * w1 + parseInt(color2[2]) * w2)];
  }
  return "rgb(" + rgb[0] + "," + rgb[1] + ","+ rgb[2] + ")"
}

function draw_letter(index, character, level, annotations, mod_level, max_level, max_mod_level) {
  var letter = document.createElement("span");
  var curr_colors = [];
  for (k = 0; k < annotations.length; k++) {
    var select_ids = ['annotation0','annotation1','annotation2','annotation3']
      for (i = 0; i < select_ids.length; i++) {
        if (annotations[k] == document.getElementById(select_ids[i]).value) {
          curr_colors.push(document.getElementById("style_" + select_ids[i]).style.backgroundColor);
          break;
        }
      }
    }

  if (mod_level > 0) {
    letter.style.backgroundColor = level_to_color(mod_level, 'mod');
  }

  if (curr_colors.length > 0) {
      var curr_colors_sorted = curr_colors;
      prev = letter;
      for (var i = 0; i < curr_colors_sorted.length; i++) {
        var inner = document.createElement("span");
        inner.className = "annotation";
        inner.style = "border-color:" + curr_colors_sorted[i]
        prev.appendChild(inner);
        prev = inner;
      }
      prev.innerHTML = character
  } else {
    letter.innerHTML = character;
  }
  letter.style.color = level_to_color(level/max_level, 'coverage');

  letter.addEventListener('click',function() {
    var url_string = window.location.href
    var url = new URL(url_string);
    var c = url.searchParams.get("protein");
    var url = "https://proteomics2.ucsd.edu/ProteoSAFe/result.jsp?task=5af9012897a643abaa8703341d6900ee&view=identified_variants#%7B%22Protein_input%22%3A%22"
     + encodeURIComponent(c) +
     "%22%2C%22StartAA_upperinput%22%3A%22" + index + "%22%2C%22EndAA_lowerinput%22%3A%22" + index + "%22%7D"
    window.open(url,'_blank')
    // display_position(index,character)
  });
  letter.style.cursor = "pointer";
  letter.className = "letters";
  return letter;
}

function draw_sequence(sequence,selection) {
  var sequence_coverage_type = document.getElementById("coverage").value;
  var modification_coverage_type = document.getElementById("modification").value;
  var space_width = 10;
  var sequence_html = document.getElementById("sequence");
  sequence_html.innerHTML = "";
  var letters = document.createElement("span");
  letters.className = "letters"
  var max_seq = Math.max(...Object.values(seq.levels))
  console.log(max_seq);
  var max_mod = Math.max(...Object.values(seq.mod_levels))
  for (i = 0; i < seq.characters.length; i++) {
        var outline_class = ""
        var gap_outline_class = ""
        if (i == selection[0]) {
          outline_class = "select-top select-left select-bottom"
          gap_outline_class = "select-top select-bottom"
        } else if (i == selection[1]) {
          outline_class = "select-top select-right select-bottom"
        } else if (i > selection[0] && i < selection[1]) {
          outline_class = "select-top select-bottom"
          gap_outline_class = "select-top select-bottom"
        }
        var seq_block = document.createElement("span");
        seq_block.className = "outer";
        var outer_seq_block = document.createElement("span");
        outer_seq_block.className = "outer";

        // Update letters
        var string_num = i.toString();
        var level = 0
        var mod_level = 0
        var annotations = []
        if (string_num in seq[sequence_coverage_type]) {
          level = seq[sequence_coverage_type][string_num]
        }
        if (string_num in seq.annotations) {
          annotations = seq.annotations[string_num]
        }
        if (string_num in seq[modification_coverage_type]) {
          mod_level = seq[modification_coverage_type][string_num]/seq.variant_levels[string_num]
        }
        var letter = draw_letter(i,seq.characters[i],level,annotations,mod_level,max_seq,max_mod);
        letter.className = outline_class;
        letters.appendChild(letter);

        // Display block of position number + letters
        if (i % space_width == space_width - 1 || i == seq.characters.length - 1) {
          var header_number = document.createElement("div");
          if (i != seq.characters.length - 1) {
            header_number.innerHTML = (i - i%space_width + 10);
          } else {
            header_number.innerHTML = "&nbsp;"
          }
          header_number.className = "position_number";
          seq_block.appendChild(header_number);

          // Handle spaces
          var tall_space = document.createElement("span");
          var top_space = document.createElement("div");
          top_space.className = "position_number";
          var bottom_space = document.createElement("span");
          bottom_space.className = gap_outline_class;
          tall_space.className = "outer";
          top_space.innerHTML = "&nbsp";
          bottom_space.innerHTML = "&nbsp";
          tall_space.appendChild(top_space);
          tall_space.appendChild(bottom_space);
          seq_block.appendChild(letters);
          outer_seq_block.appendChild(seq_block);
          outer_seq_block.appendChild(tall_space);
          sequence_html.appendChild(outer_seq_block);
          letters = document.createElement("span");
          letters.className = "letters"
        }
  }

}

function setAnnotationInputs() {
  var select_ids = ['annotation0','annotation1','annotation2','annotation3']
  for (i = 0; i < select_ids.length; i++) {
    var selected = document.getElementById(select_ids[i]);
    for (j = 0; j < seq.all_annotations.length; j++) {
      var option = document.createElement("option");
      option.text = seq.all_annotations[j];
      option.value = seq.all_annotations[j];
      selected.add(option);
      if (i == j) {
        selected.value = seq.all_annotations[j];
      }
    }
  }

}

function intialize() {
  document.getElementById("styleInputStart_coverage").style.backgroundColor = "rgb(200,200,200)";
  document.getElementById("styleInputEnd_coverage").style.backgroundColor = "rgb(255,0,0)";
  document.getElementById("styleInputStart_mod").style.backgroundColor = "rgb(255,255,255)";
  document.getElementById("styleInputEnd_mod").style.backgroundColor = "rgb(0,255,255)";
  document.getElementById("style_annotation0").style.backgroundColor = "teal";
  document.getElementById("style_annotation1").style.backgroundColor = "purple";
  document.getElementById("style_annotation2").style.backgroundColor = "pink";
  document.getElementById("style_annotation3").style.backgroundColor = "orange";
  set_seq(function() {
    updateCutoff('mod');
    updateCutoff('coverage');
    setSelection();
    setAnnotationInputs();
    draw_sequence(seq,selection);
    display_annotation_list(annotation_list);
    updateGradient('mod');
    updateGradient('coverage');
  });
}
