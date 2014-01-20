/*
vincent
Copyright (C) 2012-2014 Jublo IT Solutions <support@jublo.net>
https://github.com/jublonet/vincent

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

var Cidr = function () {
    var _cidr = false;
    var _subnetmask = false;
    var _ip = false;
    var _ipfrom = false;
    var _ipto = false;

    var _validateCidr = function (cidr) {
        var number0to255 = '(\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])';
        var expression = new RegExp(
            '^'
            // IPv4 part
            + number0to255
            + '(\\.(' + number0to255 + ')){0,3}'
            // CIDR part
            + '\\/([1-9]|[12]\\d|3[012])'
            + '$'
        );
        return expression.test(cidr);
    };

    var _validateIpv4 = function (ipv4) {
        var number0to255 = '(\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])';
        var expression = new RegExp(
            '^'
            // IPv4 part
            + number0to255
            + '(\\.(' + number0to255 + ')){3}'
            + '$'
        );
        return expression.test(ipv4);
    };

    var _convertIpv4ToBin = function (ipv4) {
        var bin = "";
        while (ipv4.split(".").length < 4) {
            ipv4 += ".0";
        }
        ipv4 = ipv4.split(".");
        var section_bin = "";
        for (var i = 0; i < ipv4.length; i++) {
            section_bin = parseInt(ipv4[i]).toString(2);
            while (section_bin.length < 8) {
                section_bin = "0" + section_bin;
            }
            bin += section_bin;
        }
        return bin;
    };

    var _convertBinToIpv4 = function (bin) {
        var ipv4 = "";
        for (var i = 0; i < 32; i+= 8) {
            ipv4 += parseInt(bin.substring(i, i + 8), 2) + ".";
        }
        ipv4 = ipv4.substring(0, ipv4.length - 1);
        return ipv4;
    };

    var _applySubnetBin = function (ipv4_bin, subnet_bin, filler) {
        for (var i = 0; i < 32; i++) {
            if (subnet_bin.charAt(i) == "0") {
                ipv4_bin = ipv4_bin.substring(0, i);
                for(; i < 32; i++) {
                    ipv4_bin += filler;
                }
                break;
            }
        }
        return ipv4_bin;
    };

    var _calculateFromCidr = function () {
        // get CIDR subnet data
        var subnet_int = _cidr.match(/\/(.+)$/)[1];

        // calculate subnet mask
        var subnet_bin = "";
        for (var i = 0; i < 32; i++) {
            subnet_bin += i < subnet_int ? "1" : "0";
        }
        _subnetmask = _convertBinToIpv4(subnet_bin);

        // calculate start IP
        var ipfrom = _cidr.substring(0, _cidr.indexOf("/"));
        var ipfrom_bin = _convertIpv4ToBin(ipfrom);
        _ip = _convertBinToIpv4(ipfrom_bin);
        ipfrom_bin = _applySubnetBin(ipfrom_bin, subnet_bin, "0");
        _ipfrom = _convertBinToIpv4(ipfrom_bin);

        ipto_bin = _applySubnetBin(ipfrom_bin, subnet_bin, "1");
        _ipto = _convertBinToIpv4(ipto_bin);

        return true;
    };

    var _calculateFromSubnet = function () {
        if (_ip === false || _subnetmask === false) {
            return false;
        }
        var ipfrom_bin = _convertIpv4ToBin(_ip);
        var subnet_bin = _convertIpv4ToBin(_subnetmask);
        ipfrom_bin = _applySubnetBin(ipfrom_bin, subnet_bin, "0");
        _ipfrom = _convertBinToIpv4(ipfrom_bin);

        var ipto_bin = _applySubnetBin(ipfrom_bin, subnet_bin, "1");
        _ipto = _convertBinToIpv4(ipto_bin);

        var subnet_int = subnet_bin.indexOf("0");
        _cidr = _ip + "/" + subnet_int;

        return true;
    };

    var getCidr = function () {
        return _cidr;
    };

    var setCidr = function (cidr) {
        if (! _validateCidr(cidr)) {
            return false;
        }

        _cidr = cidr;
        return _calculateFromCidr();
    };

    var getSubnetmask = function () {
        return _subnetmask;
    };

    var setSubnetmask = function (subnet) {
        if (! _validateIpv4(subnet)) {
            return false;
        }

        _subnetmask = subnet;
        return _calculateFromSubnet();
    };

    var setIp = function (ip) {
        if (! _validateIpv4(ip)) {
            return false;
        }

        _ip = ip;
        return _calculateFromSubnet();
    };

    var getIpFrom = function () {
        return _ipfrom;
    };

    var getIpTo = function () {
        return _ipto;
    };

    return {
        getCidr: getCidr,
        setCidr: setCidr,
        getSubnetmask: getSubnetmask,
        setSubnetmask: setSubnetmask,
        setIp: setIp,
        getIpFrom: getIpFrom,
        getIpTo: getIpTo
    };
};
