var clip;

$(function () {
    $("#ip, #subnet").bind("keyup change", function () {
        var cidr = new Cidr;
        cidr.setIp($("#ip").val());
        cidr.setSubnetmask($("#subnet").val());

        var cidr_value = cidr.getCidr();
        if (cidr_value !== false) {
            $("#cidr").val(cidr_value);
            $("#iprange").val(cidr.getIpFrom() + "-" + cidr.getIpTo());
        }
    });
    $("#cidr").bind("keyup change", function () {
        var cidr = new Cidr;
        cidr.setCidr($("#cidr").val());

        var subnet_value = cidr.getSubnetmask();
        if (subnet_value !== false) {
            $("#subnet").val(subnet_value);
            $("#ip").val(cidr.getIpFrom());
            $("#iprange").val(cidr.getIpFrom() + "-" + cidr.getIpTo());
        }
    });

    var clips = {};
    $("#ip, #subnet, #iprange, #cidr").each(function () {
        var id = $(this).prop("id");
        var clip = new ZeroClipboard.Client();
        clip.setHandCursor(true);

        clip.addEventListener('mouseOver', function (client) {
            clips[id].setText($("#" + id).val());
        });

        clip.glue(id + "-copy", id + "-copy-container");
        clips[id] = clip;
    });
});
