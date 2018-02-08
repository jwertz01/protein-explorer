var selection = [203,255];
var display_annotations = [false,false,false,false,false,false,false];
/* var annotation_colors = ["blue","red","green","black","gray","teal","purple"]; */
var annotation_colors = ["red","orange","gold","green","blue","purple","hotpink"];
var annotation_list = ["Modified residue","Active site","Binding site","Disulfide bond","Glycosylation","Metal binding","Natural variant"];
var annotation_to_pos = {"Modified residue":0,"Active site":1,"Binding site":2,"Disulfide bond":3,"Glycosylation":4,"Metal binding":5,"Natural variant":6};

function display_position(pos,character) {
  var message_html = document.getElementById("messages");
  message_html.innerHTML = "Clicked on amino acid " + character  + " at position " + (pos+1);
}

function swap_clicked(is_clicked, object) {
  if (is_clicked) {
    object.style.backgroundColor = 'white';
  } else {
    object.style.backgroundColor = 'lightgray';
  }
}

function display_annotation_list(annotations) {
    var annotations_html = document.getElementById("annotation_list");
    var annotations_message = document.createElement("div");
    annotations_message.innerHTML = "Select site types to highlight:"
    annotations_message.className = "serif";

    annotations_html.appendChild(annotations_message);
    var annotation_one = document.createElement("span");
    annotation_one.innerHTML = annotations[0];
    annotation_one.addEventListener('click',function() {
      swap_clicked(display_annotations[0],annotation_one);
      display_annotations[0] = !display_annotations[0];
      draw_sequence(seq,annotations[0],selection);
    });
    annotation_one.style.color = annotation_colors[0];
    annotation_one.className = "serif";
    annotation_one.style.cursor = "pointer";
    annotations_html.appendChild(annotation_one);
    var space = document.createElement("span");
    space.innerHTML = "&nbsp";
    annotations_html.appendChild(space);
    var annotation_two = document.createElement("span");
    annotation_two.innerHTML = annotations[1];
    annotation_two.addEventListener('click',function() {
      swap_clicked(display_annotations[1],annotation_two);
      display_annotations[1] = !display_annotations[1];
      draw_sequence(seq,annotations[1],selection);
    });
    annotation_two.style.color = annotation_colors[1];
    annotation_two.className = "serif";
    annotation_two.style.cursor = "pointer";
    annotations_html.appendChild(annotation_two);
    var annotation_three = document.createElement("span");
    var space = document.createElement("span");
    space.innerHTML = "&nbsp";
    annotations_html.appendChild(space);
    annotation_three.innerHTML = annotations[2];
    annotation_three.addEventListener('click',function() {
      swap_clicked(display_annotations[2],annotation_three);
      display_annotations[2] = !display_annotations[2];
      draw_sequence(seq,annotations[2],selection);
    });
    annotation_three.style.color = annotation_colors[2];
    annotation_three.className = "serif";
    annotation_three.style.cursor = "pointer";
    annotations_html.appendChild(annotation_three);
    var space = document.createElement("span");
    space.innerHTML = "&nbsp";
    annotations_html.appendChild(space);
    var annotation_four = document.createElement("span");
    annotation_four.innerHTML = annotations[3];
    annotation_four.addEventListener('click',function() {
      swap_clicked(display_annotations[3],annotation_four);
      display_annotations[3] = !display_annotations[3];
      draw_sequence(seq,annotations[3],selection);
    });
    annotation_four.style.color = annotation_colors[3];
    annotation_four.className = "serif";
    annotation_four.style.cursor = "pointer";
    annotations_html.appendChild(annotation_four);
    var space = document.createElement("span");
    space.innerHTML = "&nbsp";
    annotations_html.appendChild(space);
    var annotation_five = document.createElement("span");
    annotation_five.innerHTML = annotations[4];
    annotation_five.className = "serif";
    annotation_five.addEventListener('click',function() {
      swap_clicked(display_annotations[4],annotation_five);
      display_annotations[4] = !display_annotations[4];
      draw_sequence(seq,annotations[4],selection);
    });
    annotation_five.style.color = annotation_colors[4];
    annotation_five.style.cursor = "pointer";
    annotations_html.appendChild(annotation_five);
    var space = document.createElement("span");
    space.innerHTML = "&nbsp";
    annotations_html.appendChild(space);
    var annotation_six = document.createElement("span");
    annotation_six.innerHTML = annotations[5];
    annotation_six.className = "serif";
    annotation_six.addEventListener('click',function() {
      swap_clicked(display_annotations[5],annotation_six);
      display_annotations[5] = !display_annotations[5];
      draw_sequence(seq,annotations[5],selection);
    });
    annotation_six.style.color = annotation_colors[5];
    annotation_six.style.cursor = "pointer";
    annotations_html.appendChild(annotation_six);
    var space = document.createElement("span");
    space.innerHTML = "&nbsp";
    annotations_html.appendChild(space);
    var annotation_seven = document.createElement("span");
    annotation_seven.innerHTML = annotations[6];
    annotation_seven.className = "serif";
    annotation_seven.addEventListener('click',function() {
      swap_clicked(display_annotations[6],annotation_seven);
      display_annotations[6] = !display_annotations[6];
      draw_sequence(seq,annotations[6],selection);
    });
    annotation_seven.style.color = annotation_colors[6];
    annotation_seven.style.cursor = "pointer";
    annotations_html.appendChild(annotation_seven);
}

function level_to_color(level,log_scale = false) {
  if (log_scale) {
    level = Math.log10(level * 9 + 1)
  }
  return "rgb(" + Math.round(level*255) + ", 0, 0)";
}

function draw_letter(index, character, level, annotations) {
  var letter = document.createElement("span");
  var curr_colors = [];
  for (k = 0; k < annotations.length; k++) {
    var annotation_num = annotation_to_pos[annotations[k]];
    if (display_annotations[annotation_num] && curr_colors.indexOf(annotation_colors[annotation_num]) < 0) {
      curr_colors.push(annotation_colors[annotation_num]);
    }
   }

  //sort curr_colors by order of annotation_colors
  if (curr_colors.length > 0) {
      var curr_colors_sorted = [];
      for (var k = 0; k < annotation_colors.length; k++) {
        if (curr_colors.indexOf(annotation_colors[k]) >= 0) {
          curr_colors_sorted.push(annotation_colors[k]);
        }
      }

    /*Create background gradient with all relevant modification categories
  e.g.  letter.style = "background:linear-gradient(to bottom, red 0%, red 33%, orange 33%, orange 66%, yellow 66%, yellow 100%);" */
      var style_str = "text-shadow: -1px 0 white, 0 1px white, 1px 0 white, 0 -1px white;background:linear-gradient(to right, ";
      for (var i = 0; i < curr_colors_sorted.length; i++) {
        style_str += curr_colors_sorted[i] + " " + 100.0 * i / curr_colors_sorted.length + "%, " + curr_colors_sorted[i] + " " + 100.0 * (i + 1) / curr_colors_sorted.length + "%, ";
      }
      style_str = style_str.substring(0, style_str.length - 2) + ");";
      letter.style = style_str;
      //letter.style.color = "white";
  }
  letter.style.color = level_to_color(level, false);


  letter.innerHTML = character;
  letter.addEventListener('click',function() {
    display_position(index,character)
  });
  letter.style.cursor = "pointer";
  return letter;
}

function draw_sequence(sequence,annotation_considered,selection) {
  var space_width = 10;
  var sequence_html = document.getElementById("sequence");
  sequence_html.innerHTML = "";
  var letters = document.createElement("span");
  for (i = 0; i < seq.characters.length; i++) {
        var outline_class = ""
        if (i == selection[0]) {
          outline_class = "select-top select-left select-bottom"
        } else if (i == selection[1]) {
          outline_class = "select-top select-right select-bottom"
        } else if (i > selection[0] && i < selection[1]) {
          outline_class = "select-top select-bottom"
        }
        var seq_block = document.createElement("span");
        seq_block.className = "outer";
        var outer_seq_block = document.createElement("span");
        outer_seq_block.className = "outer";

        // Update letters
        var letter = draw_letter(i,seq.characters[i],seq.levels[i],seq.annotations[i]);
        letter.className = outline_class;
        letters.appendChild(letter);

        // Display block of position number + letters
        if (i % space_width == space_width - 1) {
          var header_number = document.createElement("div");
          header_number.innerHTML = (i - i%space_width + 10);
          header_number.className = "position_number";
          seq_block.appendChild(header_number);

          // Handle spaces
          var tall_space = document.createElement("span");
          var top_space = document.createElement("div");
          top_space.className = "position_number";
          var bottom_space = document.createElement("span");
          bottom_space.className = outline_class;
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
        }
  }

}

seq = {
'characters':'MRQSLLFLTSVVPFVLAPRPPDDPGFGPHQRLEKLDSLLSDYDILSLSNIQQHSVRKRDLQTSTHVETLLTFSALKRHFKLYLTSSTERFSQNFKVVVVDGKNESEYTVKWQDFFTGHVVGEPDSRVLAHIRDDDVIIRINTDGAEYNIEPLWRFVNDTKDKRMLVYKSEDIKNVSRLQSPKVCGYLKVDNEELLPKGLVDREPPEELVHRVKRRADPDPMKNTCKLLVVADHRFYRYMGRGEESTTTNYLIELIDRVDDIYRNTSWDNAGFKGYGIQIEQIRILKSPQEVKPGEKHYNMAKSYPNEEKDAWDVKMLLEQFSFDIAEEASKVCLAHLFTYQDFDMGTLGLAYVGSPRANSHGGVCPKAYYSPVGKKNIYLNSGLTSTKNYGKTILTKEADLVTTHELGHNFGAEHDPDGLAECAPNEDQGGKYVMYPIAVSGDHENNKMFSNCSKQSIYKTIESKAQECFQERSNKVCGNSRVDEGEECDPGIMYLNNDTCCNSDCTLKEGVQCSDRNSPCCKNCQFETAQKKCQEAINATCKGVSYCTGNSSECPPPGNAEDDTVCLDLGKCKDGKCIPFCEREQQLESCACNETDNSCKVCCRDLSGRCVPYVDAEQKNLFLRKGKPCTVGFCDMNGKCEKRVQDVIERFWDFIDQLSINTFGKFLADNIVGSVLVFSLIFWIPFSILVHCVDKKLDKQYESLSLFHPSNVEMLSSMDSASVRIIKPFPAPQTPGRLQPAPVIPSAPAAPKLDHQRMDTIQEDPSTDSHMDEDGFEKDPFPNSSTAAKSFEDLTDHPVTRSEKAASFKLQRQNRVDSKETEC',
'levels':[0.8, 0.8, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.7, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.5, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.4, 0.4, 0.4, 0.4, 0.9, 0.9, 0.9, 0.9, 0.9, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.7, 0.7, 0.7, 0.0, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.5, 0.5, 0.5, 0.5, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.0, 0.0, 0.0, 0.0, 0.9, 0.9, 0.9, 0.9, 0.9, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.4, 0.4, 0.4, 0.4, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.6, 0.6, 0.6, 0.6, 0.6, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.8, 0.8, 0.8, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.6, 0.6, 0.6, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9],
annotations:[['Modified residue', 'Active site', 'Binding site', 'Disulfide bond', 'Glycosylation', 'Metal binding', 'Natural variant'], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], ['Glycosylation'], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], ['Glycosylation'], [], [], [], [], ['Natural variant'], [], [], [], [], [], [], [], [], [], [], [], ['Glycosylation'], [], [], [], [], [], [], [], [], [], ['Metal binding'], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], ['Natural variant'], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], ['Disulfide bond'], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], ['Glycosylation'], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], ['Disulfide bond'], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], ['Disulfide bond'], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], ['Metal binding'], ['Active site'], [], [], ['Metal binding'], [], [], [], [], [], ['Metal binding'], [], [], [], [], [], [], [], ['Disulfide bond'], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], ['Glycosylation'], ['Disulfide bond'], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], ['Disulfide bond'], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], ['Glycosylation'], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], ['Disulfide bond'], [], [], [], [], ['Glycosylation'], [], [], [], [], [], [], [], [], [], [], [], ['Glycosylation'], [], [], [], ['Disulfide bond'], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], ['Disulfide bond'], [], [], [], [], ['Disulfide bond'], [], [], [], ['Disulfide bond'], [], [], [], [], [], [], [], [], ['Disulfide bond'], [], ['Disulfide bond'], ['Glycosylation'], [], [], [], [], [], ['Disulfide bond'], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], ['Modified residue'], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], ['Modified residue'], [], [], [], [], [], ['Modified residue'], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], ['Modified residue'], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], ['Modified residue'], [], [], [], [], []]
}

function intialize() {
  draw_sequence(seq,"",selection);
  display_annotation_list(annotation_list);
}
