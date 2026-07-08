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
}

func drawCrop(_ crop: CGImage, to output: String) throws {
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

    let scale = min(CGFloat(canvasW) / image.size.width, CGFloat(canvasH) / image.size.height)
    let drawW = image.size.width * scale
    let drawH = image.size.height * scale
    let rect = NSRect(
        x: (CGFloat(canvasW) - drawW) / 2,
        y: (CGFloat(canvasH) - drawH) / 2,
        width: drawW,
        height: drawH
    )
    image.draw(in: rect, from: .zero, operation: .sourceOver, fraction: 1.0)

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

for job in jobs {
    let source: CGImage
    if let cached = cache[job.input] {
        source = cached
    } else {
        guard let image = NSImage(contentsOfFile: job.input),
              let cgImage = image.cgImage(forProposedRect: nil, context: nil, hints: nil) else {
            fputs("Cannot read image: \(job.input)\n", stderr)
            exit(1)
        }
        cache[job.input] = cgImage
        source = cgImage
    }

    let rect = CGRect(
        x: max(0, min(job.x, Double(source.width) - 1)),
        y: max(0, min(job.y, Double(source.height) - 1)),
        width: min(job.width, Double(source.width) - max(0, job.x)),
        height: min(job.height, Double(source.height) - max(0, job.y))
    ).integral

    guard let cropped = source.cropping(to: rect) else {
        fputs("Cannot crop: \(job.output)\n", stderr)
        exit(1)
    }
    try drawCrop(cropped, to: job.output)
}

print("Cropped \(jobs.count) catalog product photos.")
