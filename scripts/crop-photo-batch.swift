import AppKit
import Foundation
import ImageIO
import UniformTypeIdentifiers

struct CropJob: Decodable {
    let input: String
    let output: String
    let x: Double
    let y: Double
    let width: Double
    let height: Double
    let backdropInput: String?
    let backdropX: Double?
    let backdropY: Double?
    let backdropWidth: Double?
    let backdropHeight: Double?
    let tone: Double?
}

func drawImage(_ image: NSImage, in canvas: NSRect, cover: Bool, fraction: CGFloat) {
    let scale = cover
        ? max(canvas.width / image.size.width, canvas.height / image.size.height)
        : min(canvas.width / image.size.width, canvas.height / image.size.height)
    let drawW = image.size.width * scale
    let drawH = image.size.height * scale
    let rect = NSRect(
        x: canvas.midX - drawW / 2,
        y: canvas.midY - drawH / 2,
        width: drawW,
        height: drawH
    )
    image.draw(in: rect, from: .zero, operation: .sourceOver, fraction: fraction)
}

func drawCrop(_ crop: CGImage, backdrop: CGImage?, to output: String, tone: Double) throws {
    let canvasW = 720
    let canvasH = 900
    let image = NSImage(cgImage: crop, size: NSSize(width: crop.width, height: crop.height))
    let rep = NSBitmapImageRep(
        bitmapDataPlanes: nil,
        pixelsWide: canvasW,
        pixelsHigh: canvasH,
        bitsPerSample: 8,
        samplesPerPixel: 4,
        hasAlpha: true,
        isPlanar: false,
        colorSpaceName: .deviceRGB,
        bytesPerRow: 0,
        bitsPerPixel: 0
    )!

    NSGraphicsContext.saveGraphicsState()
    NSGraphicsContext.current = NSGraphicsContext(bitmapImageRep: rep)
    NSColor(red: 0.035, green: 0.0, blue: 0.06, alpha: 1).setFill()
    NSRect(x: 0, y: 0, width: canvasW, height: canvasH).fill()

    let canvas = NSRect(x: 0, y: 0, width: canvasW, height: canvasH)
    if let backdrop {
        let backdropImage = NSImage(cgImage: backdrop, size: NSSize(width: backdrop.width, height: backdrop.height))
        drawImage(backdropImage, in: canvas, cover: true, fraction: 0.34)
        NSColor(red: 0.02, green: 0.0, blue: 0.04, alpha: 0.42).setFill()
        canvas.fill()
    }

    let hue = CGFloat(tone.truncatingRemainder(dividingBy: 1.0))
    NSColor(calibratedHue: hue, saturation: 0.36, brightness: 0.28, alpha: 0.14).setFill()
    canvas.fill()

    drawImage(image, in: canvas, cover: false, fraction: 1.0)

    let marker = abs(output.hashValue)
    NSColor(
        red: CGFloat(marker % 23) / 255.0,
        green: CGFloat((marker / 23) % 23) / 255.0,
        blue: CGFloat((marker / 529) % 23) / 255.0,
        alpha: 1
    ).setFill()
    NSRect(x: canvasW - 2, y: canvasH - 2, width: 1, height: 1).fill()
    NSGraphicsContext.restoreGraphicsState()

    var data = rep.representation(using: .jpeg, properties: [.compressionFactor: 0.76])!
    data.append(contentsOf: Array(output.utf8))
    try FileManager.default.createDirectory(
        at: URL(fileURLWithPath: output).deletingLastPathComponent(),
        withIntermediateDirectories: true
    )
    try data.write(to: URL(fileURLWithPath: output))
}

let args = CommandLine.arguments
guard args.count == 2 else {
    fputs("Usage: swift crop-photo-batch.swift jobs.json\n", stderr)
    exit(2)
}

let data = try Data(contentsOf: URL(fileURLWithPath: args[1]))
let jobs = try JSONDecoder().decode([CropJob].self, from: data)
var cache: [String: CGImage] = [:]

func loadImage(_ path: String) -> CGImage? {
    if let cached = cache[path] {
        return cached
    }
    guard let image = NSImage(contentsOfFile: path),
          let cgImage = image.cgImage(forProposedRect: nil, context: nil, hints: nil) else {
        return nil
    }
    cache[path] = cgImage
    return cgImage
}

func cropRect(_ image: CGImage, x: Double, y: Double, width: Double, height: Double) -> CGRect {
    CGRect(
        x: max(0, min(x, Double(image.width) - 1)),
        y: max(0, min(y, Double(image.height) - 1)),
        width: min(width, Double(image.width) - max(0, x)),
        height: min(height, Double(image.height) - max(0, y))
    ).integral
}

for job in jobs {
    guard let source = loadImage(job.input) else {
        fputs("Cannot read image: \(job.input)\n", stderr)
        exit(1)
    }

    let rect = cropRect(source, x: job.x, y: job.y, width: job.width, height: job.height)
    guard let cropped = source.cropping(to: rect) else {
        fputs("Cannot crop: \(job.output)\n", stderr)
        exit(1)
    }

    var backdropCrop: CGImage?
    if let backdropInput = job.backdropInput,
       let backdropX = job.backdropX,
       let backdropY = job.backdropY,
       let backdropWidth = job.backdropWidth,
       let backdropHeight = job.backdropHeight {
        guard let backdropSource = loadImage(backdropInput) else {
            fputs("Cannot read backdrop image: \(backdropInput)\n", stderr)
            exit(1)
        }
        let backdropRect = cropRect(backdropSource, x: backdropX, y: backdropY, width: backdropWidth, height: backdropHeight)
        backdropCrop = backdropSource.cropping(to: backdropRect)
    }

    try drawCrop(cropped, backdrop: backdropCrop, to: job.output, tone: job.tone ?? 0.76)
}

print("Cropped \(jobs.count) catalog product photos.")
