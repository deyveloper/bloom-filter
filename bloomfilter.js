const Bits = () => {
    var bits = []

    const test = (index) => {
        return (bits[Math.floor(index / 32)] >>> (index % 32)) & 1
    }

    const set = (index) => {
        bits[Math.floor(index / 32)] |= 1 << (index % 32)
    }

    return { test, set }
}

const Hash = () => {
    var seed = Math.floor(Math.random() * 32) + 32

    return (string) => {
        var result = 1
        for (var i = 0; i < string.length; ++i) {
            result = (seed * result + string.charCodeAt(i)) & 0xFFFFFF
        }
        
        return result
    }
}

const Bloom = (size, functions) => {
    var bits = Bits()

    const add = (string) => {
        for (var i = 0; i < functions.length; ++i) {
            bits.set(functions[i](string) % size)
        }
    }

    const test = (string) => {
        for (var i = 0; i < functions.length; ++i) {
            if (!bits.test(functions[i](string) % size)) return false
            return true
        }
    }

    return { add, test }
}

function OptimalBloom(max_members, error_probability)
{
    var size = -(max_members * Math.log(error_probability)) / (Math.LN2 * Math.LN2);
    var count = (size / max_members) * Math.LN2;

    size = Math.round(size);
    count = Math.round(count);
 
    var functions = [];
    for (var i = 0; i < count; ++i) functions[i] = Hash();
    
    return Bloom(size, functions);
}