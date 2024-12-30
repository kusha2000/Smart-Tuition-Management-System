import 'dart:io';
import 'dart:typed_data';
import 'package:camera/camera.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:image/image.dart' as img;

class TakePictureScreen extends StatefulWidget {
  const TakePictureScreen({super.key, required this.camera});

  final CameraDescription camera;

  @override
  TakePictureScreenState createState() => TakePictureScreenState();
}

class TakePictureScreenState extends State<TakePictureScreen> {
  late CameraController _controller;
  late Future<void> _initializeControllerFuture;
  String _result = '';
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
    super.dispose();
  }

  Future<void> uploadImage(File image) async {
    try {
      final request = http.MultipartRequest(
          'POST', Uri.parse('http://10.0.2.2:5000/check_faces'));
      request.files.add(await http.MultipartFile.fromPath('file', image.path));
      final response = await request.send();

      final responseBody = await response.stream.bytesToString();
      if (response.statusCode == 200) {
        setState(() {
          _result = responseBody;
        });
      } else if (response.statusCode == 600) {
        setState(() {
          _result = "I can't identify your face";
        });
      } else {
        setState(() {
          _result =
              'Failed to upload image. Error code: ${response.statusCode}\nServer response: $responseBody';
        });
      }
    } catch (e) {
      setState(() {
        _result = 'Error uploading image: $e';
      });
    }
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Take a Picture')),
      body: FutureBuilder<void>(
        future: _initializeControllerFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.done) {
            return Stack(
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
            );
          } else {
            return const Center(child: CircularProgressIndicator());
          }
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () async {
          try {
            await _initializeControllerFuture;
            final image = await _controller.takePicture();
            final rotatedImageFile = await _rotateImage(image.path);

            await uploadImage(rotatedImageFile);

            if (!context.mounted) return;

            await Navigator.of(context).push(
              MaterialPageRoute(
                builder: (context) => DisplayPictureScreen(
                  imagePath: image.path,
                  result: _result,
                ),
              ),
            );
          } catch (e) {
            print(e);
          }
        },
        child: const Icon(Icons.camera_alt),
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

    final rectWidth = size.width * 0.6;
    final rectHeight = size.height * 0.3;
    final centerX = size.width / 2;
    final centerY = size.height / 3;

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

class DisplayPictureScreen extends StatelessWidget {
  final String imagePath;
  final String result;

  const DisplayPictureScreen(
      {super.key, required this.imagePath, required this.result});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Display the Picture')),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Transform.rotate(
              angle: 3 * 3.14159 / 2,
              child: Image.file(File(imagePath)),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Text(
              result,
              style: const TextStyle(fontSize: 16, color: Colors.white),
              textAlign: TextAlign.center,
            ),
          ),
        ],
      ),
    );
  }
}
