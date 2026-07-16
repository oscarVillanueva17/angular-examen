import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { DependenciaService } from '../../services/dependencia.service';
import { Dependencia } from '../../models/dependencia.model';

@Component({
    selector: 'app-dependencias',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './dependencias.component.html'
})
export class DependenciasComponent {
    private svc = inject(DependenciaService);
    private fb = inject(FormBuilder);

    data = signal<any>(null);
    editId = signal<number | null>(null);
    error = signal<string | null>(null);
    page = signal(0);
    search = signal('');
    dependenciasActivas = signal<number | null>(null);
    dependenciasInactivas = signal<number | null>(null);

    correoFilter = signal('');
    activoFilter = signal<boolean | null>(null);
    fechaInicioFilter = signal('');
    fechaFinFilter = signal('');


    form = this.fb.group({
        nombre: ['', [Validators.required, Validators.minLength(3)]],
        direccion: [''],
        telefono: [''],
        correo: ['', [Validators.required, Validators.email]],
        responsable: ['', [Validators.required]],
        municipio: ['', [Validators.required]]
    });

    ngOnInit() { this.load(); this.cargarConteo() }

    load() {
        this.svc.listar({
            nombre: this.search(), correo: this.correoFilter(), activo: this.activoFilter(), fechaInicio: this.fechaInicioFilter(),
            fechaFin: this.fechaFinFilter()
        }, this.page())
            .subscribe({ next: d => this.data.set(d), error: e => this.error.set(e.message) });
    }

    cargarConteo() {
        this.svc.obtenerTotales().subscribe(totales => {
            this.dependenciasActivas.set(totales.activas);
            this.dependenciasInactivas.set(totales.inactivas);
        });
    }

    submit() {
        if (this.form.invalid) return;
        const op = this.editId()
            ? this.svc.actualizar(this.editId()!, this.form.value as Dependencia)
            : this.svc.crear({ ...this.form.value, activo: true } as Dependencia);
        op.subscribe({ next: () => { this.reset(); this.load(); this.cargarConteo(); }, error: e => this.error.set(e.error?.correo ?? e.message) });
    }

    edit(d: Dependencia) { this.editId.set(d.id!); this.form.patchValue(d); }

    toggle(id: number) { this.svc.toggle(id).subscribe(() => { this.load(); this.cargarConteo() }) }

    reset() { this.editId.set(null); this.form.reset(); this.cargarConteo(); }

    setPage(p: number) { this.page.set(p); this.load(); }

    delete(id: number) {
        if (!confirm('¿Estás seguro de que deseas eliminar esta dependencia?')) return;
        this.svc.eliminar(id).subscribe(() => { this.load(); this.cargarConteo(); });
    }

}
