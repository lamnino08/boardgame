'use client';

import { DropdownShowcase } from '@/components/ui/form/base-component/dropdown';
import { TextInputShowcase } from '@/components/ui/form/base-component/text-input';
import { FileInputShowcase } from '@/components/ui/form/base-component/file-input';
import { MultipleOptionShowCase } from '@/components/ui/form/base-component/multiple-option';
import React from 'react';
import { RangeInputShowCase } from '@/components/ui/form/base-component/input-range';
import { ColorPickerShowcase } from '@/components/ui/form/base-component/color-pick';
import { TextAreaShowcase } from '@/components/ui/form/base-component/text-area';

export default function FormComponentsPage() {
  return (
    <div className="p-8 bg-background rounded-lg shadow-xl space-y-8">
      <h1 className="text-3xl font-bold text-text-dark">Form Components</h1>

      <section>
        <h2 className="text-2xl font-semibold mb-4 text-text-dark">Text Input</h2>
        <TextInputShowcase />
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4 text-text-dark">Text area</h2>
        <TextAreaShowcase />
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4 text-text-dark">Dropdown Showcase</h2>
        <DropdownShowcase />
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4 text-text-dark">File Input</h2>
        <FileInputShowcase />
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4 text-text-dark">Multiple options</h2>
        <MultipleOptionShowCase />
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4 text-text-dark">Range input</h2>
        <RangeInputShowCase />
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4 text-text-dark">Color picker</h2>
        <ColorPickerShowcase />
      </section>
    </div>
  );
}