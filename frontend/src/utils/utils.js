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

    addOne(month)
    {
      return month + 1;
    },

    toISOString(date) {
        let month =
          date.getMonth() < 9
            ? "0" + module.exports.addOne(date.getMonth())
            : module.exports.addOne(date.getMonth());
        let day = date.getDate() <= 9 ? "0" + date.getDate() : date.getDate();
        let hours = date.getHours() <= 9 ? "0" + date.getHours() : date.getHours();
        let minutes =
          date.getMinutes() <= 9 ? "0" + date.getMinutes() : date.getMinutes();
    
        return (
          date.getFullYear() + "-" + month + "-" + day + "T" + hours + ":" + minutes
        );
      }
  };
  
  