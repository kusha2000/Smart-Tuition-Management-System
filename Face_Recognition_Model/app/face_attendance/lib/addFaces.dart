import 'dart:io';
import 'dart:typed_data';
import 'package:camera/camera.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:image/image.dart' as img;

class RegisterFaceScreen extends StatefulWidget {
  const RegisterFaceScreen({super.key, required this.camera});

  final CameraDescription camera;

  @override
  State<RegisterFaceScreen> createState() => _RegisterFaceScreenState();
}

class _RegisterFaceScreenState extends State<RegisterFaceScreen> {
  late CameraController _controller;
  late Future<void> _initializeControllerFuture;
  final TextEditingController _nameController = TextEditingController();
  bool _isRegistering = false;
  int _imagesCaptured = 0;
  String _result = '';
  List<String> _imagePaths = [];
  int _rotationAngle = 270;

  @override
  void initState() {
    super.initState();
    _controller = CameraController(
      widget.camera,
      ResolutionPreset.medium,
    );
    _initializeControllerFuture = _controller.initialize();
  }

  @override
  void dispose() {
    _controller.dispose();
    _nameController.dispose();
    super.dispose();
  }

  Future<File> _rotateImage(String imagePath) async {
    try {
      final imageFile = File(imagePath);
      final imageBytes = await imageFile.readAsBytes();
      img.Image? image = img.decodeImage(Uint8List.fromList(imageBytes));

      if (image != null) {
        img.Image rotatedImage = img.copyRotate(image, angle: _rotationAngle);

        final rotatedImageFile =
            File('${Directory.systemTemp.path}/rotated_image.jpg')
              ..writeAsBytesSync(img.encodeJpg(rotatedImage));

        return rotatedImageFile;
      } else {
        throw Exception("Failed to decode image.");
      }
    } catch (e) {
      print("Error rotating image: $e");
      rethrow;
    }
  }

  Future<void> _captureAndSendImages(String name) async {
    try {
      setState(() {
        _isRegistering = true;
        _imagesCaptured = 0;
        _imagePaths = [];
      });

      for (int i = 0; i < 100; i++) {
        final image = await _controller.takePicture();
        final rotatedImageFile = await _rotateImage(image.path);
        _imagePaths.add(rotatedImageFile.path);

        setState(() {
          _imagesCaptured = i + 1;
        });
      }

      final request = http.MultipartRequest(
        'POST',
        Uri.parse('http://10.0.2.2:5000/register_face'),
      );
      request.fields['name'] = name;
      for (final path in _imagePaths) {
        request.files.add(await http.MultipartFile.fromPath('images', path));
      }

      final response = await request.send();
      final responseBody = await response.stream.bytesToString();

      setState(() {
        if (response.statusCode == 200) {
          _result = "Success: $responseBody";
        } else {
          _result = "Error: $responseBody";
        }
      });
    } catch (e) {
      setState(() {
        _result = "Error: $e";
      });
    } finally {
      setState(() {
        _isRegistering = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Register Face')),
      resizeToAvoidBottomInset: true,
      body: FutureBuilder<void>(
        future: _initializeControllerFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.done) {
            return SingleChildScrollView(
              child: Column(
                children: [
                  SizedBox(
                    height: MediaQuery.of(context).size.height * 0.6,
                    child: Stack(
                      children: [
                        Transform.rotate(
                          angle: _rotationAngle * 3.14159 / 180,
                          child: CameraPreview(_controller),
                        ),
                        Center(
                          child: CustomPaint(
                            size: MediaQuery.of(context).size,
                            painter: RectanglePainter(),
                          ),
                        ),
                      ],
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      children: [
                        if (_isRegistering)
                          Text("Images Captured: $_imagesCaptured/100",
                              style: const TextStyle(fontSize: 18)),
                        if (!_isRegistering)
                          Padding(
                            padding: const EdgeInsets.all(16.0),
                            child: TextField(
                              controller: _nameController,
                              decoration: const InputDecoration(
                                labelText: 'Enter your name',
                                border: OutlineInputBorder(),
                              ),
                            ),
                          ),
                        ElevatedButton(
                          onPressed: _isRegistering
                              ? null
                              : () async {
                                  final name = _nameController.text.trim();
                                  if (name.isEmpty) {
                                    setState(() {
                                      _result = "Name cannot be empty!";
                                    });
                                    return;
                                  }

                                  await _initializeControllerFuture;
                                  _captureAndSendImages(name);
                                },
                          child: const Text('Register Face'),
                        ),
                        Padding(
                          padding: const EdgeInsets.all(16.0),
                          child: Text(
                            _result,
                            style: const TextStyle(fontSize: 16),
                            textAlign: TextAlign.center,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            );
          } else {
            return const Center(child: CircularProgressIndicator());
          }
        },
      ),
    );
  }
}

class RectanglePainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.green
      ..strokeWidth = 3
      ..style = PaintingStyle.stroke;

    final rectWidth = size.width * 0.7;
    final rectHeight = size.height * 0.5;
    final centerX = size.width / 2;
    final centerY = size.height / 2;

    final rect = Rect.fromCenter(
      center: Offset(centerX, centerY),
      width: rectWidth,
      height: rectHeight,
    );

    canvas.drawRect(rect, paint);
  }

  @override
  bool shouldRepaint(CustomPainter oldDelegate) => false;
}
