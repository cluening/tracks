Start a local webserver to serve this stuff up:
```
python -m http.server -b 127.0.0.1 8080
```

Convert yaml to json with `yq`:
```
yq -p yaml -o json library.yaml
```
