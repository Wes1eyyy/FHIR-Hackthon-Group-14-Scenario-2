export { linear_regression };

const mean = (arr) => arr.reduce((s, c) => s + c, 0) / arr.length;

const zip = (a, b) => a.map((k, i) => [k, b[i]]);

const mul_sum = (a, b) => zip(a, b).reduce(([a, b], c) => a * b + c, 0);

const linear_regression = (x, y) => {
  const len = x.length;

  const x_mean = mean(x);
  const y_mean = mean(y);

  const xy_dev = mul_sum(x, y) - len * x_mean * y_mean;
  const xx_dev = mul_sum(x, x) - len * x_mean * x_mean;

  const m = xy_dev / xx_dev;
  return {
    m: m,
    b: y_mean - m * x_mean
  };
};

