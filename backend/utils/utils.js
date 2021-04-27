module.exports = {
    tp_item_list: {
      2: "competition.php?id_comp=",
      3: "equipa.php?id=",
      4: "jogador.php?id=",
      8: "estadio.php?id=",
      9: "coach.php?id=",
      10: "local.php?id=",
      13: "arbitro.php?id=",
      16: "dirigente.php?id=",
      17: "agent.php?id=",
    },

    buildPageInformation(row)
    {
      let url = "https://www.zerozero.pt/" + module.exports.tp_item_list[row.tp_item] + row.fk_item
      
      if(row.tp_item == 18)
      {
        if(row.link.search('https://www.zerozero.pt/') == -1)
          url = "https://www.zerozero.pt/" + row.link;
        else
          url = row.link
      }

      return {
        tp_item: row.tp_item,
        fk_item: row.fk_item,
        n: row.n,
        localUrl: "/admin/page?tp_item=" +  row.tp_item + "&fk_item=" + row.fk_item,
        partialUrl: url.replace('https://www.zerozero.pt/',''),
        fullUrl: url,
      }
    }
    
  };
  
  